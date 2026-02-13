package com.trainer.app.controller;

import com.trainer.app.dto.CertificateResponseDto;
import com.trainer.app.model.CourseCertificate;
import com.trainer.app.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/certificates")
@CrossOrigin(origins = "http://localhost:3000")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;
    
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "OK");
        response.put("message", "Certificate service is running");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam("traineeEmpId") String traineeEmpId,
            @RequestParam("courseId") Long courseId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            CertificateResponseDto certificate = certificateService.uploadCertificate(file, traineeEmpId, courseId);
            
            response.put("success", true);
            response.put("message", "Certificate uploaded successfully");
            response.put("certificate", certificate);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to upload certificate: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/course/{courseId}/trainer/{trainerEmpId}")
    public ResponseEntity<?> getCertificatesByCourse(
            @PathVariable Long courseId,
            @PathVariable String trainerEmpId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<CertificateResponseDto> certificates = certificateService.getCertificatesByCourse(courseId, trainerEmpId);
            
            response.put("success", true);
            response.put("certificates", certificates);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch certificates: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @GetMapping("/download/{certificateId}/trainer/{trainerEmpId}")
    public ResponseEntity<Resource> downloadCertificate(
            @PathVariable Long certificateId,
            @PathVariable String trainerEmpId) {
        
        try {
            CourseCertificate certificate = certificateService.getCertificateForDownload(certificateId, trainerEmpId);
            
            Path filePath = Paths.get(certificate.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type based on file extension
            String contentType = "application/octet-stream";
            String fileName = certificate.getFileName().toLowerCase();
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + certificate.getFileName() + "\"")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/view/{certificateId}/trainer/{trainerEmpId}")
    public ResponseEntity<Resource> viewCertificate(
            @PathVariable Long certificateId,
            @PathVariable String trainerEmpId) {
        
        try {
            CourseCertificate certificate = certificateService.getCertificateForDownload(certificateId, trainerEmpId);
            
            Path filePath = Paths.get(certificate.getFilePath());
            Resource resource = new UrlResource(filePath.toUri());
            
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }
            
            // Determine content type for inline viewing
            String contentType = "application/octet-stream";
            String fileName = certificate.getFileName().toLowerCase();
            if (fileName.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.endsWith(".png")) {
                contentType = "image/png";
            }
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}