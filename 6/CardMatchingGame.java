import java.util.HashMap;

/**
 * 此類別使用 HashMap 記錄每個卡片數字出現的次數，
 * 並支援新增卡片、移除卡片、檢查卡片、計算總卡片數以及計算配對數量。
 */
public class CardMatchingGame {

    /**
     * 處理卡片遊戲的指令，並回傳所有需要輸出的結果。
     *
     * 支援的指令包含：
     * add n、remove n、check n、count、pair。
     *
     * @return 所有輸出結果，每一行以換行符號分隔
     */
    public static String process(String[] commands) {
        /**
         * 記錄每個卡片數字目前出現的次數。
         * key 代表卡片上的數字，value 代表該數字卡片的數量。
         */
        HashMap<Integer, Integer> cards = new HashMap<Integer, Integer>();

        /**
         * 記錄目前桌面上的卡片總數。
         */
        int totalCards = 0;

        /**
         * 記錄目前桌面上可以形成的配對總數。
         */
        int totalPairs = 0;

        /**
         * 儲存所有需要輸出的結果。
         */
        StringBuilder result = new StringBuilder();

        for (String command : commands) {
            String[] parts = command.split(" ");
            String operation = parts[0];

            if (operation.equals("add")) {
                int n = Integer.parseInt(parts[1]);

                int oldCount = cards.getOrDefault(n, 0);
                int newCount = oldCount + 1;

                totalPairs -= oldCount / 2;
                totalPairs += newCount / 2;

                cards.put(n, newCount);
                totalCards++;
            } 
            else if (operation.equals("remove")) {
                int n = Integer.parseInt(parts[1]);

                if (!cards.containsKey(n) || cards.get(n) == 0) {
                    result.append("Card not found").append("\n");
                } 
                else {
                    int oldCount = cards.get(n);
                    int newCount = oldCount - 1;

                    totalPairs -= oldCount / 2;
                    totalPairs += newCount / 2;

                    if (newCount == 0) {
                        cards.remove(n);
                    } 
                    else {
                        cards.put(n, newCount);
                    }

                    totalCards--;
                }
            } 
            else if (operation.equals("check")) {
                int n = Integer.parseInt(parts[1]);

                if (cards.containsKey(n) && cards.get(n) > 0) {
                    result.append("true").append("\n");
                } 
                else {
                    result.append("false").append("\n");
                }
            } 
            else if (operation.equals("count")) {
                result.append(totalCards).append("\n");
            } 
            else if (operation.equals("pair")) {
                result.append(totalPairs).append("\n");
            }
        }

        if (result.length() > 0) {
            result.deleteCharAt(result.length() - 1);
        }

        return result.toString();
    }
}