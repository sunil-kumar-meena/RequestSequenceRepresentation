# RequestSequenceRepresentation

### Location
This application belongs to the representation layer.

### Description
The RequestSequenceRepresentation application converts the tabular information as it is provided by EATL://v1/list-records-of-flow into a graphical representation.  
This is for supporting the administrators of the application layer in its debugging.  

Registering and a reduced embedding process makes the connection to EaTL available for approval in ALT and operation key management by OKM.  
Basic management and self-information services are supported.  
User management is carried out via the AdministratorAdministration application.  
The RequestSequenceRepresentation can also be started via the GenericRepresentation application.  
An update process (bequeath-your-data-and-die) is not supported.  
There is no application data to be stored in a file or database.  

### Relevance
This application supports efficiently debugging the application layer.

### Resources
- [Specification](./spec/README.md)
- [TestSuite](./testing/)
- [Implementation](./server/)

### Comments
./.

# How to execute application
## use below command
1. npm start
 
# How to create react build
1. npm run build

## docker commands
# Create docker image from docker file
step 1. docker build -t IMAGE_NAME .

# Create and run docker container
step 2. docker run -p HOST_PORT:CONTAINER_PORT -d --name CONTAINER_NAME IMAGE_NAME

# Run existing docker container
1. docker start CONTAINER_NAME

# Remove docker image
1. docker image rm IMAGE_NAME

# Remove docker container first
1. docker rm CONTAINER_NAME

## Steps to create/run docker container from GitLab/GitHub
1. git clone REPO_URL
2. docker build -t IMAGE_NAME .
3. docker run -p HOST_PORT:CONTAINER_PORT -d --name CONTAINER_NAME IMAGE_NAME