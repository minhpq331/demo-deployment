# Demo deployment

Demo deployment ứng dụng NodeJS trên Kubernetes

## Thông tin về ứng dụng

Các biến môi trường:

|   Tên biến   | Điều kiện  | Giá trị mẫu |             Diễn giải              |
|--------------|------------|-------------|------------------------------------|
| `PORT`       | `required` | 3000        | Cổng app lắng nghe                 |
| `MESSAGE`    | `required` | Hello world | Thông điệp khi gọi API sẽ hiển thị |
| `CONFIG_ENV` | `optional` | Username    | Mẫu env từ configmap               |
| `SECRET_ENV` | `optional` | Password    | Mẫu env từ secret                  |

Docker image (đã có sẵn và chỉ cần dùng):

- V1.0: `minhpq331/demo-deployment:v1.0`

## Các lệnh kubectl thường dùng

```bash
# List các pod đang chạy
kubectl -n <ns> get pod

# List các deployment
kubectl -n <ns> get deployment

# Log pod đang chạy
kubectl -n <ns> logs <pod-name>

# Kiểm tra mô tả deployment
kubectl -n <ns> describe deployment <dep-name>

# Apply định nghĩa resource
kubectl -n <ns> apply -f file.yaml

# Forward port về local
kubectl -n <ns> port-forward pod/<pod-name> <local_port>:<container_port>
```

## Bài thực hành 1: Triển khai NodeJS API

Các bước thực hiện:

- Clone repo này về máy
- Tạo namespace mang tên mình

```bash
kubectl create ns <name>
```

- Chỉnh sửa file `deployment.yaml`, thay thế **tên deployment**, **label**, **container image**, **số replica**, **biến môi trường** như được cung cấp phía trên. Ứng dụng chạy **version 1.0**
- Apply file `deployment.yaml` bằng lệnh: 

```bash
kubectl -n <ns> apply -f deployment.yaml
```

- Kiểm tra pod xem đã chạy chưa bằng `kubectl get` và `kubectl logs`

```bash
kubectl -n <ns> get pod  # để lấy pod name
kubectl -n <ns> logs <pod-name>
```

- Port-forward tới localhost để kiểm tra response của pod:

```bash
kubectl -n <ns> port-forward pod/<pod-name> <local_port>:<container_port>
```

- Truy cập `http://localhost:<local_port>`

## Bài thực hành 2: Mounting config

### Mount configmap bằng env

- Sửa file `configmap.yaml`, sửa lại tên configmap và thêm cặp key-value: `CONFIG_ENV=Username`
- Apply configmap vào hệ thống:

```bash
kubectl -n <ns> apply -f configmap.yaml
```

- Sửa file `deployment.yaml` và thêm biến môi trường từ configmap theo mẫu như sau (đây là bản rút gọn, lưu ý indent):

```yaml
spec:
  template:
    spec:
      containers:                       
        - name: web                     
          image: some-image
          env:
            - name: CONFIG_ENV
              valueFrom:
                configMapKeyRef:
                  name: <configmap-name>
                  key: <key-in-configmap>
```

- Apply lại `deployment.yaml` vào hệ thống bằng `kubectl apply`
- Port-forward về local và kiểm tra đường dẫn: `http://localhost:<local_port>/config-env`

### Mount configmap bằng file

- Mở file `config.example.json` và copy nội dung bên trong
- Sửa file `configmap.yaml`, và thêm cặp key-value: `configfile=<nội dung file json>`. Lưu ý đây là nội dung nhiều dòng
- Apply configmap vào hệ thống bằng `kubectl apply`
- Sửa file `deployment.yaml` và thêm mount file `/app/config.json` từ configmap theo mẫu như sau (đây là bản rút gọn, lưu ý indent):

```yaml
spec:
  template:
    spec:
      containers:                       
        - name: web                     
          image: some-image
          volumeMounts:
            - name: config-volume
              mountPath: /app/config.json
              subPath: <key-in-configmap>    
      volumes:
        - name: config-volume
          configMap:
            name: <configmap-name> 
```

- Apply lại `deployment.yaml` vào hệ thống bằng `kubectl apply`
- Port-forward về local và kiểm tra đường dẫn: `http://localhost:<local_port>/config-file`

### Mount secret bằng env

- Sửa file `secret.yaml`, sửa lại tên secret và thêm cặp key-value: `SECRET_ENV=Password`
- Apply secret vào hệ thống:

```bash
kubectl -n <ns> apply -f secret.yaml
```

- Sửa file `deployment.yaml` và thêm biến môi trường từ secret tương tự khi thêm biến môi trường bằng configmap. Tuy nhiên bạn hãy search google xem value từ secret thì nó như nào cho thành thạo.
- Apply lại `deployment.yaml` vào hệ thống bằng `kubectl apply`
- Port-forward về local và kiểm tra đường dẫn: `http://localhost:<local_port>/secret-env`

### Mount secret bằng file

- Mở file `secret.example.json` và copy nội dung bên trong
- Sửa file `secret.yaml`, và thêm cặp key-value: `secretfile=<nội dung file json>`. Lưu ý đây là nội dung nhiều dòng
- Apply secret vào hệ thống bằng `kubectl apply`
- Sửa file `deployment.yaml` và thêm mount file `/app/secret.json` từ secret. Cái này cũng tương tự như configmap, bạn tự search google rồi thêm vào cho thạo
- Apply lại `deployment.yaml` vào hệ thống bằng `kubectl apply`
- Port-forward về local và kiểm tra đường dẫn: `http://localhost:<local_port>/secret-file`
