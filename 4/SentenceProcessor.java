import java.util.*;

public class SentenceProcessor {

    public String removeDuplicatedWords(String sentence) {
        String[] words = sentence.trim().split("\\s+");

        Set<String> seen = new HashSet<>();
        ArrayList<String> result = new ArrayList<>();

        for (String word : words) {
            if (!seen.contains(word)) {
                seen.add(word);
                result.add(word);
            }
        }

        return String.join(" ", result);
    }

    public String replaceWord(String target, String replacement, String sentence) {
        String[] words = sentence.trim().split("\\s+");

        for (int i = 0; i < words.length; i++) {
            if (words[i].equals(target)) {
                words[i] = replacement;
            }
        }

        return String.join(" ", words);
    }
}