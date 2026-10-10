kubectl create namespace kafka
kubectl create namespace monitoring

helm repo add flink-operator-repo https://downloads.apache.org/flink/flink-kubernetes-operator-1.16.1/
helm repo add cnpg https://cloudnative-pg.io/charts/
helm repo update

helm install \
  cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.21.2 \
  --namespace cert-manager \
  --create-namespace \
  --set crds.enabled=true


helm upgrade --install cnpg-operator cnpg/cloudnative-pg \
  --namespace cnpg-system \
  --create-namespace \
  --version 0.29.1

helm upgrade --install flink-kubernetes-operator \
  flink-operator-repo/flink-kubernetes-operator \
  --create-namespace \
  --set 'watchNamespaces[0]=default' \
  --set rbac.create=true
