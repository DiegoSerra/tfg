export class Race {
  _id?: string;
  createdBy?: {userId: string, email: string};
  name?: string;
  dateStart?: Date;
  dateEnd?: Date;
  results: {
    position: number;
    runnerName: string;
    gender: string;
    age: string;
    time: string;
    rhythm: string;
    };
}
