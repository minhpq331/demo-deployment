# Demo deployment

Demo deployment on K8S with NodeJS

Required environment:

- `PORT`: 3000
- `MESSAGE`: Message to show on runtime

Image:

- V1.0: `minhpq331/demo-deployment:v1.0`
- V2.0: `minhpq331/demo-deployment:v2.0`

## Configmap:

Edit `configmap.yaml`, apply it and mounting configmap as env: 

```
CONFIG_ENV=This is config env
```

Edit `configmap.yaml`, add `config.json` entry with content in `config.example.json`

Mount `config.json` configmap as `/app/config.json`.

> Hint: Use `subPath`

Check endpoint:

- /config-env
- /config-file

## Secret

Edit `secret.yaml`, apply it and mounting secret as env: 

```
SECRET_ENV=This is secret env
```

Edit `secret.yaml`, add `secret.json` entry with content in `secret.example.json`

Mount `secret.json` secret as `/app/secret.json`

> Hint: Use `subPath`

Check endpoint:

- /secret-env
- /secret-file