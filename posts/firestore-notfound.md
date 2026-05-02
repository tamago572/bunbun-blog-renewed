# Firestoreに秘密鍵もProjectIdもあってるのにNotFoundになるときの忘備録

## エラー内容

```
Firebaseに接続しました  
Firestoreに接続しました  
Server is running on [http://localhost:3000](vscode-file://vscode-app/c:/Users/bunbun/AppData/Local/Programs/Microsoft%20VS%20Code%20Insiders/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)  
Getting articles from Firestore...  
Error getting articles: Error: 5 NOT_FOUND:  
at callErrorFromStatus (/home/bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/call.js:32:19)  
at Object.onReceiveStatus (/home/bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/client.js:359:73)  
at Object.onReceiveStatus (/home/bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/client-interceptors.js:324:181)  
at /bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/resolving-call.js:135:78  
at process.processTicksAndRejections (node:internal/process/task_queues:85:11)  
for call at  
at ServiceClientImpl.makeServerStreamRequest (/home/bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/client.js:342:32)  
at ServiceClientImpl.<anonymous> (/home/bunbun/apps/bunbun-blog/backend/node_modules/@grpc/grpc-js/build/src/make-client.js:105:19)  
at /bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/v1/firestore_client.js:237:29  
at /bunbun/apps/bunbun-blog/backend/node_modules/google-gax/build/src/streamingCalls/streamingApiCaller.js:38:28  
at /bunbun/apps/bunbun-blog/backend/node_modules/google-gax/build/src/normalCalls/timeout.js:44:16  
at Object.request (/home/bunbun/apps/bunbun-blog/backend/node_modules/google-gax/build/src/streamingCalls/streaming.js:234:40)  
at makeRequest (/home/bunbun/apps/bunbun-blog/backend/node_modules/retry-request/index.js:159:28)  
at retryRequest (/home/bunbun/apps/bunbun-blog/backend/node_modules/retry-request/index.js:119:5)  
at StreamProxy.setStream (/home/bunbun/apps/bunbun-blog/backend/node_modules/google-gax/build/src/streamingCalls/streaming.js:225:37)  
at StreamingApiCaller.call (/home/bunbun/apps/bunbun-blog/backend/node_modules/google-gax/build/src/streamingCalls/streamingApiCaller.js:54:16)  
Caused by: Error  
at QueryUtil._getResponse (/home/bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/reference/query-util.js:44:23)  
at CollectionReference._getResponse (/home/bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/reference/query.js:784:32)  
at CollectionReference._get (/home/bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/reference/query.js:777:35)  
at /bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/reference/query.js:745:43  
at /bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/telemetry/enabled-trace-util.js:110:30  
at NoopContextManager.with (/home/bunbun/apps/bunbun-blog/backend/node_modules/@opentelemetry/api/build/src/context/NoopContextManager.js:25:19)  
at ContextAPI.with (/home/bunbun/apps/bunbun-blog/backend/node_modules/@opentelemetry/api/build/src/api/context.js:60:46)  
at NoopTracer.startActiveSpan (/home/bunbun/apps/bunbun-blog/backend/node_modules/@opentelemetry/api/build/src/trace/NoopTracer.js:65:31)  
at ProxyTracer.startActiveSpan (/home/bunbun/apps/bunbun-blog/backend/node_modules/@opentelemetry/api/build/src/trace/ProxyTracer.js:36:24)  
at EnabledTraceUtil.startActiveSpan (/home/bunbun/apps/bunbun-blog/backend/node_modules/@google-cloud/firestore/build/src/telemetry/enabled-trace-util.js:102:28) {  
code: 5,  
details: '',  
metadata: Metadata {  
internalRepr: Map(1) { 'x-debug-tracking-id' => [Array] },  
options: {}  
}  
}
```

エラーが出ます。認証情報は合ってるしidもあってます。

## 解決策

```typescript
const db = getFirestore(app, process.env.FIREBASE_DB_ID || "default"); // 第二引数にdbのIDを記述する。
```

デフォルトでは(default)となり通るが、Firestore作成時にDBにIDを設定した場合それを設定しないと弾かれる。
