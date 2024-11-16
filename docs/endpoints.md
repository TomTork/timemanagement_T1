# Endpoints
## Workers
- [GET, level=1] ```/workers``` - получить всех рабочих
- [PUT, level=1] ```/worker/?login=...&password=...&name=...``` - создать нового рабочего
- [DELETE, level=1] ```/worker/:id``` - удалить рабочего (передавать documentId)
- [POST, level=1] ```/worker/:id``` - обновить рабочего (передвать documentId) | IWorker

## WorkTime
- [GET, level=0] ```/worktime/:id``` - получить время работы по id
- [GET, level=0] ```/worktimes``` - получить всё общее время работы
- [DELETE, level=1] ```/delete-worktime/:id``` - удалить время работы (передавать documentId)
- [POST, level=0] ```/worktime/:id``` - обновить время работы | IUWorkTime

## Token
- [GET] ```/token/?login=...&password=...``` - получить токен

## Work
- [PUT, level=0] ```/work``` - создать работу | IWork
- [DELETE, level=1] ```/work/:id``` - удалить работу
- [POST, level=0] ```/update-work/:id``` - обновить работу | IUWork

### Важно: картинки необходимо передавать в соответствии с интерфейсом, они должны приходить в формате Blob или Base64