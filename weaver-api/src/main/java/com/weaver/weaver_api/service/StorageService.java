package com.weaver.weaver_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class StorageService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String s3Endpoint;

    public StorageService(S3Client s3Client, 
                          @Value("${aws.s3.bucket-name}") String bucketName,
                          @Value("${aws.s3.endpoint}") String s3Endpoint) {
        this.s3Client = s3Client;
        this.bucketName = bucketName;
        this.s3Endpoint = s3Endpoint;
    }

    public String uploadFile(MultipartFile file, UUID categoryId, String sku) throws IOException {
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().replaceAll("[^a-zA-Z0-9.\\-]", "_") : "file";
        String key = String.format("products/category=%s/sku=%s/%s-%s",
                categoryId,
                sku,
                UUID.randomUUID(),
                filename
        );
        
        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        // Return the full URL of the uploaded file
        return s3Endpoint + "/" + bucketName + "/" + key;
    }
}