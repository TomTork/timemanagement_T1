import {IPhoto} from "./IPhoto";

export interface IWorkTime {
  id: number,
  documentId: string,
  worktimes: {
    start: any,
    end: any,
    done: boolean | null,
    finish: IPhoto[],
    work: {
      name: string,
      description: string,
      photos: IPhoto[]
    }
  }[]
}

export interface ILocalWorkTime {
  id: number,
  documentId: string,
  start: any,
  end: any,
  done: boolean | null,
  finish: IPhoto[],
  work: {
    name: string,
    description: string,
    photos: IPhoto[]
  }
}