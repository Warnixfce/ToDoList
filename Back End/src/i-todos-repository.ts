export interface ITodosRepository {
    Retrieve(callback): void;
    Add(todoObj: { id: any; completed: any; title: any }, callback): void;
    Delete(id: any, callback: () => any): void;
    Update(todoObj: { id: any; completed: any; title: any }, callback: (results) => any): void;
}