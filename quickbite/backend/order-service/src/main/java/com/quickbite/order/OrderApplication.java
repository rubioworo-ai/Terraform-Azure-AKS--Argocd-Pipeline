package com.quickbite.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.http.ResponseEntity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.Duration;

@SpringBootApplication
public class OrderApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderApplication.class, args);
    }
}

// ---------------- MODEL: CustomerOrder ----------------
@Entity
@Table(name = "customer_order")
class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "customer_name", nullable = false)
    private String customerName;

    @Column(name = "food_item", nullable = false)
    private String foodItem;

    private Integer quantity;
    private String status = "PENDING";

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getFoodItem() { return foodItem; }
    public void setFoodItem(String foodItem) { this.foodItem = foodItem; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

// ---------------- REPOSITORY ----------------
@Repository
interface CustomerOrderRepository extends JpaRepository<CustomerOrder, Long> {}

// ---------------- CONTROLLER ----------------
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
class OrderController {

    @Autowired
    private CustomerOrderRepository orderRepository;

    @PostMapping
    public ResponseEntity<CustomerOrder> createOrder(@RequestBody CustomerOrder order) {
        if (order.getCustomerName() == null || order.getFoodItem() == null) {
            return ResponseEntity.badRequest().build();
        }
        order.setStatus("PENDING");
        order.setCreatedAt(LocalDateTime.now());
        CustomerOrder savedOrder = orderRepository.save(order);
        System.out.println("[Order Service] Order #" + savedOrder.getId() + " received for " + savedOrder.getCustomerName());
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerOrder> getOrder(@PathVariable Long id) {
        return orderRepository.findById(id)
            .map(order -> {
                // Dynamic tracking updates based on elapsed time since creation
                long elapsedSeconds = Duration.between(order.getCreatedAt(), LocalDateTime.now()).toSeconds();
                if (elapsedSeconds > 60) {
                    order.setStatus("DELIVERED");
                } else if (elapsedSeconds > 35) {
                    order.setStatus("OUT_FOR_DELIVERY");
                } else if (elapsedSeconds > 12) {
                    order.setStatus("PREPARING");
                }
                
                // Save updated status
                CustomerOrder updatedOrder = orderRepository.save(order);
                return ResponseEntity.ok(updatedOrder);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
