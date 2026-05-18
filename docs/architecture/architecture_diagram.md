# Architecture Diagram

```mermaid
architecture-beta
    group client [Browser Client (React/Vite)]
    
    service router [React Router DOM] in client
    service ui [React UI Components] in client
    service state [Local State & Hooks] in client
    service storage [LocalStorage (teian_projects)] in client
    
    group backend [Backend Infrastructure]
    service api [Mock API Client] in backend
    service s3 [AWS S3 / Storage (Mock)] in backend
    service ai [AI Layout Engine (Mock)] in backend
    service ai_presen [AI Presentation Mock] in backend
    service ai_estimate [AI Estimate Mock] in backend
    service ai_image [AI Image Mock] in backend
    
    router -- ui : Routes
    ui -- state : State Management
    state -- storage : Persist (Projects Data)
    state -- api : Fetch Data
    
    api -- s3 : Read/Extract Files
    api -- ai : Generate Layout
    api -- ai_presen : Generate Presen
    api -- ai_estimate : Generate Estimate
    api -- ai_image : Generate Image
```
