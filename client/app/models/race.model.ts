export class Race {
  _id?: string;
  createdBy?: {userId: string, email: string};
  name?: string;
  dateStart?: Date;
  dateEnd?: Date;
  results: {
    position: number,
    time: number,
    rhythm: number,
    dorsal: number,
    runnerName: string,
    positionCategory: number,
    category: string,
    club: string,
  };
}
