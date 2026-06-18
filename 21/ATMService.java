public interface ATMService {
	public boolean checkBalance(Account account, int money) throws ATMException;
	public boolean isValidAmount(int money) throws ATMException;
	public void withdraw(Account account, int money);
}