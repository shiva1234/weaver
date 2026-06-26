package com.weaver.weaver_api.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
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

    /**
     * Upload images for a product using the structure: products/{productId}/{sequence}.{ext}
     * Numbering starts from startIndex + 1.
     */
    public List<String> uploadProductImages(UUID productId, List<MultipartFile> files, int startIndex) throws IOException {
        List<String> urls = new ArrayList<>();
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String ext = getExtension(file.getOriginalFilename());
            String key = String.format("products/%s/%d.%s", productId, startIndex + i + 1, ext);

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            urls.add(buildUrl(key));
        }
        return urls;
    }

    /**
     * Upload images starting from sequence 1 (for new products).
     */
    public List<String> uploadProductImages(UUID productId, List<MultipartFile> files) throws IOException {
        return uploadProductImages(productId, files, 0);
    }

    /**
     * Delete all images under products/{productId}/
     */
    public void deleteProductImages(UUID productId) {
        String prefix = String.format("products/%s/", productId);

        ListObjectsV2Request listRequest = ListObjectsV2Request.builder()
                .bucket(bucketName)
                .prefix(prefix)
                .build();

        ListObjectsV2Response listResponse = s3Client.listObjectsV2(listRequest);

        List<ObjectIdentifier> toDelete = listResponse.contents().stream()
                .map(obj -> ObjectIdentifier.builder().key(obj.key()).build())
                .toList();

        if (!toDelete.isEmpty()) {
            DeleteObjectsRequest deleteRequest = DeleteObjectsRequest.builder()
                    .bucket(bucketName)
                    .delete(Delete.builder().objects(toDelete).build())
                    .build();
            s3Client.deleteObjects(deleteRequest);
        }
    }

    private String buildUrl(String key) {
        return s3Endpoint + "/" + bucketName + "/" + key;
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}