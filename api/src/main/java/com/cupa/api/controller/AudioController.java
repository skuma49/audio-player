package com.cupa.api.controller;

import com.cupa.api.util.EncryptionUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;

import java.time.Duration;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})
public class AudioController {

    @Autowired
    private S3Client s3Client;

    @Autowired
    private S3Presigner s3Presigner;

    @Autowired
    private EncryptionUtil encryptionUtil;

    @Value("${aws.bucket.name}")
    private String bucketName;

    @GetMapping("/presigned-url")
    public ResponseEntity< String> getPresignedUrl(@RequestParam String fileId) {
        try {
            // Create a GetObjectRequest
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileId)
                    .build();

            // Create a GetObjectPresignRequest
            GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(5)) // URL valid for 5 minutes
                    .getObjectRequest(getObjectRequest)
                    .build();

            // Generate the pre-signed URL
            PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);
            String presignedUrl = presignedRequest.url().toString();

            // Encrypt the pre-signed URL
            /*
            String encryptedUrl = encryptionUtil.encrypt(presignedUrl);

            Map<String, String> response = new HashMap<>();
            response.put("encryptedUrl", encryptedUrl); // Ensure this is set
            response.put("salt", encryptionUtil.getSalt()); // Ensure this is set

             */
            return ResponseEntity.ok(presignedUrl);

        } catch (Exception e) {
            e.printStackTrace();
            return null;//ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating pre-signed URL");
        }
    }

    @GetMapping("/stream")
    public ResponseEntity<InputStreamResource> streamAudio(@RequestParam String fileId) {
        try {
            // Create a GetObjectRequest
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(fileId)
                    .build();

            // Fetch the object from S3
            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);

            // Get the metadata (e.g., content length)
            GetObjectResponse metadata = s3Object.response();

            // Set headers for streaming
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentLength(metadata.contentLength());
            headers.setContentDispositionFormData("attachment", fileId);

            // Stream the audio file to the client
            return new ResponseEntity<>(new InputStreamResource(s3Object), headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}