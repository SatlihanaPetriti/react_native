import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { getTokenFromCookie } from './helpers/cookie.helper';
import { SendMessageDto } from './dto/send-message.dto';
import { CreateMessageDto } from './dto/create-message.dto';
// Gateway per komunikimin me WebSocket
@WebSocketGateway({
  cors: {
    origin: true,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
  ) { }
  // autentikimi kur lidhet socketi, kontrollon nese ka cookie dhe nese ka JWT valide, nese jo e disconnecton socketin
  public async handleConnection(client: Socket) {
    console.log('New socket connection');
    // Merr cookie nga handshake
    const cookieHeader = client.handshake.headers.cookie;
    console.log('Cookie:', cookieHeader);
    if (!cookieHeader) {
      console.log('No cookie found');
      client.disconnect();
      return;
    }
    // Merr JWT nga cookie
    const token = getTokenFromCookie(cookieHeader);

    if (!token) {
      console.log('No JWT found');
      client.disconnect();
      return;
    }

    try {
      // Verifiko JWT
      const payload = this.jwtService.verify<{ id: number }>(token);
      // Gjej user-in
      const user = await this.userService.findOne(payload.id);
      // Kontrollo nese useri ekziston
      if (!user) {
        console.log('User not found');
        client.disconnect();
        return;
      }
      // Ruaj userin ne socket
      client.data.user = user;
      console.log(`User ${user.id} connected with socket ${client.id}`);
    } catch (error) {
      console.log('Invalid JWT:', error);

      client.disconnect();
    }
  }
  // Fut userin ne conversation room
  @SubscribeMessage('joinRoom')
  public async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: number,
  ) {
    console.log('JOIN ROOM EVENT RECEIVED:', conversationId);
    // Kontrollo conversationId
    if (!conversationId) {
      client.emit('roomError', {
        message: 'Conversation ID is required',
      });
      return;
    }
    const parsedConversationId = Number(conversationId);

    if (Number.isNaN(parsedConversationId)) {
      client.emit('roomError', {
        message: 'Invalid conversation ID',
      });

      return;
    }

    const user = client.data.user;
    // Kontrollo nese useri eshte participant (vlen njesoj per 1:1 dhe grup)
    const isParticipant = await this.chatService.isParticipant(parsedConversationId, user.id);
    if (!isParticipant) {
      client.emit('roomError', {
        message:
          'You are not a participant of this conversation',
      });
      return;
    }
    // krijo emrin e room 
    const roomName = `conversation:${parsedConversationId}`;
    // fut socket ne room
    await client.join(roomName);

    console.log(`User ${user.id} joined ${roomName}`);
    // konfirmo qe useri eshte futur ne room
    client.emit('roomJoined', {
      conversationId: parsedConversationId,
      roomName,
    });
  }
  // dergo mesazhin ne converstion (funksionon njesoj per 1:1 dhe grup)
  @SubscribeMessage('sendMessage')
  public async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: SendMessageDto,
  ) {
    console.log('SEND MESSAGE EVENT RECEIVED:', data);
    // kontrollo t edhenat
    if (!data?.conversationId || !data?.content?.trim()) {
      client.emit('messageError', {
        message: 'Conversation ID and message are required'
      });

      return;
    }
    const user = client.data.user;
    // Kontrollo participantin
    const isParticipant = await this.chatService.isParticipant(data.conversationId, user.id);

    if (!isParticipant) {
      client.emit('messageError', {
        message: 'You are not a participant of this conversation'
      });

      return;
    }
    // Ruhet mesazhi ne db
    const createMessageDto: CreateMessageDto = {
      conversationId: data.conversationId,
      senderId: user.id,
      content: data.content.trim(),
    };

    const savedMessage = await this.chatService.createMessage(
      createMessageDto,
    );
    // emri i room
    const roomName = `conversation:${data.conversationId}`;
    // Dergo mesazhin te gjithe pjesemarresit e room
    this.server
      .to(roomName)
      .emit('messageReceived', savedMessage);
    console.log(`Message ${savedMessage.id} saved and emitted to ${roomName}`,);
  }

  // Useri shenon biseden si "e lexuar" - i njofton te tjeret ne room per checkmarkat blu
  @SubscribeMessage('markAsRead')
  public async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: number },
  ) {
    console.log('MARK AS READ EVENT RECEIVED:', data);

    if (!data?.conversationId) {
      client.emit('readError', {
        message: 'Conversation ID is required',
      });
      return;
    }

    const user = client.data.user;

    try {
      const result = await this.chatService.markAsRead(
        data.conversationId,
        user.id,
      );

      const roomName = `conversation:${data.conversationId}`;
      // Njofto te gjithe ne room qe ky user i ka lexuar mesazhet deri tani
      this.server.to(roomName).emit('messagesRead', result);

      console.log(`User ${user.id} marked ${roomName} as read`);
    } catch (error) {
      console.log('Mark as read failed:', error);
      client.emit('readError', {
        message: 'You are not a participant of this conversation',
      });
    }
  }
}