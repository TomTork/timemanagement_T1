export interface IWork {
  start: any,
  end: any,
  done: boolean | null,
  name: string,
  description: string,
  finish?: string[] | null,
  in_progress?: string[] | null,
  user: number // id
}