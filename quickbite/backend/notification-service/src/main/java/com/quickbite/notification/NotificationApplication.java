package com.quickbite.notification;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.Map;

@SpringBootApplication
public class NotificationApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
    }
}

// ---------------- CONTROLLER: NotificationController ----------------
@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
class NotificationController {

    @PostMapping
    public ResponseEntity<String> dispatchNotification(@RequestBody Map<String, Object> payload) {
        Object orderId = payload.get("orderId");
        String customMsg = (String) payload.get("message");
        
        System.out.println("[Notification Service] Simulating order trigger alert for Order #" + orderId);
        
        // Return exact requested notification confirmation text
        return ResponseEntity.ok("Your order has been received");
    }
}
