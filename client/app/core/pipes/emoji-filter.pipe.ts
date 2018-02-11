import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'emojiFilter'
})
@Injectable()
export class EmojiFilterPipe implements PipeTransform {
  transform(emojis: any, args: any[]): any {
    if (!args[0] || args[0] === '') {
      return emojis;
    }

    return emojis.filter(emoji => emoji.name.toLowerCase().includes(args[0].toLowerCase()));
  }
}
