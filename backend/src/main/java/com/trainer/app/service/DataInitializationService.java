package com.trainer.app.service;

import com.trainer.app.model.Batch;
import com.trainer.app.repository.BatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationService implements CommandLineRunner {
    
    @Autowired
    private BatchRepository batchRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default batch if it doesn't exist
        if (batchRepository.findByName("Advanced JavaScript") == null) {
            Batch jsBatch = new Batch("Advanced JavaScript", "Advanced JavaScript concepts and ES6+ features", "TR001");
            batchRepository.save(jsBatch);
        }
    }
}