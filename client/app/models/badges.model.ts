import {Badge} from './badge.model';

export class Badges {
  public chat: Badge = {
    bg: 'blue',
    fg: 'white',
    count: 0
  };

  constructor({chat = 0}) {
    this.chat.count = chat;
  }
}
