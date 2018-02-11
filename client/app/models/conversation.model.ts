export declare interface Conversation {
  _id: string;
  userMessages: [{
    sender: string,
    body: string,
    createdAt: Date
  }];
}
