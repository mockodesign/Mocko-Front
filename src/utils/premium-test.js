// Premium Testing Utilities
// Add this to browser console for easy premium testing

import {
  makePremiumTest,
  removePremiumTest,
  setPremiumLastMonthTest,
  getUserSubscription,
} from "@/services/subscription-service";
import { useEditorStore } from "@/store";

// Make functions globally available in browser console
if (typeof window !== "undefined") {
  window.testPremium = {
    // Make current user premium
    async makePremium() {
      try {
        const result = await makePremiumTest();
        console.log("✅ User is now premium!", result);

        // Refresh the store
        const store = useEditorStore.getState();
        const subscription = await getUserSubscription();
        store.setUserSubscription(subscription.data);

        alert("You are now premium! Refresh the page to see changes.");
        return result;
      } catch (error) {
        console.error("❌ Failed to make premium:", error);
        alert("Failed to make premium: " + error.message);
      }
    },

    // Remove premium status
    async removePremium() {
      try {
        const result = await removePremiumTest();
        console.log("✅ Premium status removed!", result);

        // Refresh the store
        const store = useEditorStore.getState();
        const subscription = await getUserSubscription();
        store.setUserSubscription(subscription.data);

        alert("Premium status removed! Refresh the page to see changes.");
        return result;
      } catch (error) {
        console.error("❌ Failed to remove premium:", error);
        alert("Failed to remove premium: " + error.message);
      }
    },

    // Check current subscription
    async checkStatus() {
      try {
        const result = await getUserSubscription();
        console.log("📊 Current subscription status:", result);
        return result;
      } catch (error) {
        console.error("❌ Failed to check status:", error);
      }
    },

    // Set premium to last month (for testing expiration)
    async setLastMonth() {
      try {
        const result = await setPremiumLastMonthTest();
        console.log(
          "✅ Premium set to last month (should be expired)!",
          result
        );

        // Refresh the store
        const store = useEditorStore.getState();
        const subscription = await getUserSubscription();
        store.setUserSubscription(subscription.data);

        alert(
          "Premium set to last month! Check if it shows as expired. Refresh the page."
        );
        return result;
      } catch (error) {
        console.error("❌ Failed to set last month:", error);
        alert("Failed to set last month: " + error.message);
      }
    },
  };

  // Console instructions
  console.log(`
🎯 Premium Testing Available!

Use these commands in console:
• testPremium.makePremium() - Make yourself premium
• testPremium.removePremium() - Remove premium status  
• testPremium.setLastMonth() - Set premium to last month (test expiration)
• testPremium.checkStatus() - Check current status

Example:
testPremium.setLastMonth().then(() => location.reload())
testPremium.checkStatus() // Should show isPremium: false if expired
  `);
}

export default window.testPremium;
