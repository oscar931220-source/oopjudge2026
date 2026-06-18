/**
 * The SimpleATMService class implements ATMService.
 */
public class SimpleATMService implements ATMService {

    /**
     * Checks whether the account has enough balance.
     *
     * @param account the account to check
     * @param money the amount of money to withdraw
     * @return true if the balance is enough
     * @throws ATMException if the balance is not enough
     */
    public boolean checkBalance(Account account, int money) throws ATMException {
        if (account.getBalance() < money) {
            throw new ATMException(ATMException.ExceptionType.BALANCE_NOT_ENOUGH);
        }

        return true;
    }

    /**
     * Checks whether the withdrawal amount is valid.
     *
     * @param money the amount of money to withdraw
     * @return true if the amount is valid
     * @throws ATMException if the amount is invalid
     */
    public boolean isValidAmount(int money) throws ATMException {
        if (money % 1000 != 0) {
            throw new ATMException(ATMException.ExceptionType.AMOUNT_INVALID);
        }

        return true;
    }

    /**
     * Withdraws money from the account.
     *
     * @param account the account to withdraw from
     * @param money the amount of money to withdraw
     */
    public void withdraw(Account account, int money) {
        try {
            checkBalance(account, money);
            isValidAmount(money);
            account.setBalance(account.getBalance() - money);
        } catch (ATMException e) {
            System.out.println(e.getMessage());
        }

        System.out.println("updated balance : " + account.getBalance());
    }
}