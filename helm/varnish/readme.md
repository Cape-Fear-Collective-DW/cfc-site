
# Installation Steps

1. Create a secret for the administration on the production namespace: `kubectl create secret generic varnish-secret-temp -n production --from-literal=secret=$(head -c32 /dev/urandom  | base64)`
2. Create the required service account for RBAC
```
# create service account
kubectl create -n production serviceaccount kube-httpcache

# apply cluster role default rbac configuration
kubectl apply -n production -f https://raw.githubusercontent.com/mittwald/kube-httpcache/master/deploy/kubernetes/rbac.yaml

# create rolebinding role/account
kubectl create -n production rolebinding kube-httpcache --clusterrole=kube-httpcache --serviceaccount=production:kube-httpcache
```

# Deployment Steps

1. Apply the Varnish configuration configmap: `kubectl apply -f config.yaml`
2. Deploy Varnish deployments: `kubectl apply -f deploy.yaml`
3. Create Ingress to point to varnish service `kubectl apply -f ingress.yaml`

# Docs

- [https://github.com/mittwald/kube-httpcache](https://github.com/mittwald/kube-httpcache)
