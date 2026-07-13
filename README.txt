Projet Final - Deploiement Kubernetes d'une application Web

Execution rapide sur ma machine (Docker Desktop + Kubernetes)

1. Ouvrir PowerShell dans le dossier du projet:

cd "C:\Users\LEGION\Documents\Conteneurisation et Orchestration\projet de conteneurisation"

2. Construire les images locales:

docker build -t ton-user-dockerhub/pf-backend:1.0 ./app/backend
docker build -t ton-user-dockerhub/pf-frontend:1.0 ./app/frontend

3. Deployer dans Kubernetes:

kubectl apply -f k8s/

4. Verifier que les pods et services sont actifs:

kubectl get pods -n projet-final
kubectl get svc -n projet-final

5. Ouvrir l'application:

http://localhost:30080

Si Docker Desktop n'expose pas directement le NodePort, lancer ce port-forward
et garder cette fenetre PowerShell ouverte:

kubectl port-forward -n projet-final svc/frontend-service 30080:80

Puis ouvrir:

http://localhost:30080

6. Tester les endpoints:

curl.exe -i http://localhost:30080/api/health
curl.exe -i http://localhost:30080/api/hello
curl.exe -i http://localhost:30080/api/items

7. Arreter et supprimer le deploiement:

kubectl delete -f k8s/

1. Architecture

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

Le navigateur appelle le frontend avec des URLs relatives:
- /api/hello
- /api/items

Nginx relaie ces appels vers backend-service:3000 dans le cluster.

2. Build & push

docker build -t <ton-user-dockerhub>/pf-backend:1.0 ./app/backend
docker push <ton-user-dockerhub>/pf-backend:1.0

docker build -t <ton-user-dockerhub>/pf-frontend:1.0 ./app/frontend
docker push <ton-user-dockerhub>/pf-frontend:1.0

Pour les tests locaux:

docker build -t ton-user-dockerhub/pf-backend:1.0 ./app/backend
docker build -t ton-user-dockerhub/pf-frontend:1.0 ./app/frontend

3. Deploiement

kubectl apply -f k8s/

Fichiers Kubernetes:
1. k8s/00-namespace.yaml
2. k8s/01-backend-deployment.yaml
3. k8s/02-backend-service.yaml
4. k8s/03-frontend-deployment.yaml
5. k8s/04-frontend-service.yaml
6. k8s/05-backend-configmap.yaml
7. k8s/06-frontend-configmap.yaml

4. Acces navigateur

Docker Desktop:
http://localhost:30080

Minikube:
minikube ip
puis http://<IP>:30080

Ou:
minikube service frontend-service -n projet-final

5. Endpoints

GET /api/health
Reponse attendue:
{ "status": "ok" }

GET /health
Alias de health check:
{ "status": "ok" }

GET /api/hello
Renvoie un JSON avec message et data.

GET /api/items
Renvoie un JSON avec une liste d'items.

Les probes Kubernetes utilisent /api/health sur le port 3000.

6. Verification

- Cloner le depot.
- Builder et pousser les images Docker.
- Executer kubectl apply -f k8s/.
- Verifier les pods: kubectl get pods -n projet-final.
- Verifier les services: kubectl get svc -n projet-final.
- Ouvrir http://localhost:30080 avec Docker Desktop.
- Cliquer sur hello et items pour afficher les reponses JSON.
- Verifier le health check avec curl http://localhost:30080/api/health.

7. Nettoyage

kubectl delete -f k8s/

8. Nettoyage des anciennes images locales

Pour eviter que Docker Desktop ou Kubernetes reutilise une ancienne version,
ne garder que ces deux images du projet:

- ton-user-dockerhub/pf-backend:1.0
- ton-user-dockerhub/pf-frontend:1.0

Supprimer les anciens tags temporaires si presents:

docker rmi ton-user-dockerhub/pf-backend:run-local
docker rmi ton-user-dockerhub/pf-backend:health-ui-local
docker rmi ton-user-dockerhub/pf-frontend:run-local
docker rmi ton-user-dockerhub/pf-frontend:no-message-20260713-1209
docker rmi ton-user-dockerhub/pf-frontend:health-ui-local

Puis reconstruire uniquement les tags officiels:

docker build -t ton-user-dockerhub/pf-backend:1.0 ./app/backend


docker build -t ton-user-dockerhub/pf-frontend:1.0 ./app/frontend
8. Les captures d'ecrans sont dans le dossier docs du projet.
