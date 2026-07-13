# Projet Final - Deploiement Kubernetes d'une application Web

## 1. Architecture

```
Navigateur
  |
  | http://<IP_NOEUD>:30080
  v
Service frontend (NodePort 30080)
  |
  v
Deployment frontend (Nginx, reverse proxy)
  |
  | proxy /api/* vers backend-service:3000
  v
Service backend (ClusterIP)
  |
  v
Deployment backend (Node.js 20 + Express)
```

Le navigateur appelle uniquement le frontend avec une URL relative, par exemple
`fetch('/api/hello')` ou `fetch('/api/items')`. Nginx, dans le pod frontend, relaie ensuite la requete vers
le Service Kubernetes interne `backend-service` sur le port `3000`.

## 2. Build & push

```bash
docker build -t <ton-user-dockerhub>/pf-backend:1.0 ./app/backend
docker push <ton-user-dockerhub>/pf-backend:1.0
docker build -t <ton-user-dockerhub>/pf-frontend:1.0 ./app/frontend
docker push <ton-user-dockerhub>/pf-frontend:1.0
```

Pour les tests locaux sans Docker Hub, utiliser le meme nom d'image avec un
placeholder local valide, par exemple `ton-user-dockerhub/pf-backend:1.0` et
`ton-user-dockerhub/pf-frontend:1.0`.

## 3. Deploiement

```bash
kubectl apply -f k8s/
```

Les manifests sont dans `k8s/`:

1. `00-namespace.yaml`
2. `01-backend-deployment.yaml`
3. `02-backend-service.yaml`
4. `03-frontend-deployment.yaml`
5. `04-frontend-service.yaml`
6. `05-backend-configmap.yaml`
7. `06-frontend-configmap.yaml`

## 4. Acces navigateur

Docker Desktop:

```text
http://localhost:30080
```

Minikube:

```bash
minikube ip
```

Puis ouvrir:

```text
http://<IP>:30080
```

Ou lancer:

```bash
minikube service frontend-service -n projet-final
```

## 5. Capture d'ecran

Emplacement reserve pour la capture d'ecran de l'application apres deploiement
reel sur Kubernetes:

```text
docs/capture-kubernetes-nodeport.png
```

## 6. Verification

- Cloner le depot.
- Builder et pousser les images Docker.
- Executer `kubectl apply -f k8s/`.
- Verifier les pods avec `kubectl get pods -n projet-final`.
- Verifier les services avec `kubectl get svc -n projet-final`.
- Ouvrir l'application dans un navigateur avec le NodePort `30080`.
- Tester les endpoints JSON `/api/hello` et `/api/items`; `/api/health` reste
  l'endpoint de health check utilise par les probes Kubernetes.
- L'alias `/health` renvoie aussi `{ "status": "ok" }` pour une verification
  rapide du health check.

## 7. Nettoyage des anciennes images locales

Pour eviter que Docker Desktop ou Kubernetes reutilise une ancienne version,
ne garder que ces deux images du projet:

```text
ton-user-dockerhub/pf-backend:1.0
ton-user-dockerhub/pf-frontend:1.0
```

Supprimer les anciens tags temporaires si presents:

```bash
docker rmi ton-user-dockerhub/pf-backend:run-local
docker rmi ton-user-dockerhub/pf-backend:health-ui-local
docker rmi ton-user-dockerhub/pf-frontend:run-local
docker rmi ton-user-dockerhub/pf-frontend:no-message-20260713-1209
docker rmi ton-user-dockerhub/pf-frontend:health-ui-local
```

Puis reconstruire uniquement les tags officiels:

```bash
docker build -t ton-user-dockerhub/pf-backend:1.0 ./app/backend
docker build -t ton-user-dockerhub/pf-frontend:1.0 ./app/frontend
```
