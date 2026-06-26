package com.weaver.weaver_api.repository;

import com.weaver.weaver_api.model.RecentlyViewed;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RecentlyViewedRepository extends JpaRepository<RecentlyViewed, UUID> {
    List<RecentlyViewed> findTop10ByCustomerIdOrderByViewedAtDesc(UUID customerId);
    List<RecentlyViewed> findTop10ByGuestTokenOrderByViewedAtDesc(String guestToken);
}
