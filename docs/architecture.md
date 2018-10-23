# Архитектура

Вкратце об архитектуре и как с ней работать.

У [desktop_client](https://github.com/MoonSHRD/desktop_client) 
есть 2 паралельно работающих процесса, 
которые обмениваются данными посредством IPC (событий) 
именующиеся **IpcMain** (бэк) и **IpcRenderer** (фронт).

## IpcMain

IpcMain использует MVC архитектуру. 
В нем есть стандартный набор сущностей 
Router, Model, Controller и ControllerRegister.

### Router

Отвечает за перенаправление всех входящих событий в контроллеры, 
будь то запрос с сервера или IpcRenderer.

Содержит параметры:
 - ipcMain 
 - dxmpp из [moonshard_core](https://github.com/MoonSHRD/core)
 - controller_register 
 
Для обработки событий используется метод listen_event(откуда_слушать, название_события, коллбэк)

#### Пример

```typescript
this.listen_event(this.ipcMain, 'send_subscribe', async (event, data) => {
    await this.controller_register.queue_controller('ChatsController', 'subscribe', data);
});
```

В данном случае в качестве коллбэка идет функция, 
запускающая функцию subscribe в ChatsController и передает в нее data в качестве аргумента.

**Важно**, в качества коллбэка должна быть асинхронная функция, 
которая принимает либо 2 параметра (событие и получаемые данные), либо ничего.

### ControllerRegister

Синглтон, хранящий инстансы сонтроллеров, который имеет 2 публичных метода:
- run_controller
- queue_controller

Оба метода принимают (имя_контроллера, имя_функции, любое, количество, аргументов, для, передачи, в, функцию).
Разница в том, что первый метод запускает функцию асинхронно, 
а второй кладет ее в очередь исполнения. 
Это необходимо для тех случаев, 
когда функция должна выполнятся строго после завершения предыдущей  
и может конфликтовать при одновременном выполнении
(например запись и чтение из бд).

#### Пример взаимодействия

```typescript
controller_register.queue_controller('ChatsController', 'subscribe');
controller_register.run_controller('ChatsController', 'subscribe');
```

**Важно**, при создании нового контроллера его нужно указать в списке контроллеров, с идентичным именем, например

```typescript
SettingsController: require(__dirname + '/Main/SettingsController')
```

### Controller

Обработчик всего и всея.

Обрабатывает приходящие данные, рендерит html, забирает данные из бд, отправляет запросы на сервер и тд. и тп.

Общие приватные методы для всех контроллеров:
- render(путь_к_пагу(начиная от компонентов), объект_с_данными(опционально)) - рендерит html из пага
- get_self_info() - выдает данные о себе
- send_data(название_события, обьект с данными) - отправлет на IpcRenderer событие

Общие приватные параметры для всех контроллеров:
- инстансы из [moonshard_core](https://github.com/MoonSHRD/core)
- константы из src/var_helper.ts
- синглтоны Loom и ipfs (позднее будут вынесены в [moonshard_core](https://github.com/MoonSHRD/core) и там же описаны)

Для более полной инфы - controllers/Controller.ts


### Model

Работа с моделями прекрасно описана в [typeorm](https://github.com/typeorm/typeorm).



## IpcRenderer

IpcRenderer идентичен браузерному клиенту, за исключением, 
что обмен данными происходит не через запросы, 
а через ipcRenderer, коорый также умеет обрабатывать входящие события 
и отправять новые

#### Пример

Обработка входящего события:

```javascript
ipcRenderer.on("wallet_token_table", (event, obj) => {
    console.log(obj);
});
```
**wallet_token_table** - название события
далее коллбэк принимающий 2 аргумента: событие и входящие данные в виде обьекта   


Отправка исходящего события c пустым обьектом с данными:

```javascript
ipcRenderer.send('channel_suggestion', {});
```

## В итоге

Пример работы событий в мессенджере выглядит следующим образом:

ipcRenderer обрабатывает клик на элемент и отправляет нужные данные на ipcMain,
ipcMain ловит это событие в Router, 
который в свою очередь запускает функцию контроллера, 
где эти данные обрабатываются, 
при надобности рендерятся в html через pug 
и отправляются новым событием обратно на ipcRenderer, 
который добавляет эти данные в ui.

P.S. для полного понимания взимодействия Router и событий не из ipcRenderer, 
надо знать устройство [moonshard_core](https://github.com/MoonSHRD/core).
