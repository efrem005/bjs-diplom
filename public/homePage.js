const logout = new LogoutButton()
logout.action = () => {
	const responseToLogout = response => {
		if (response.success) {
			location.reload()
		}
	}

	ApiConnector.logout(responseToLogout)
}

ApiConnector.current(response => {
	if (response.success) {
		ProfileWidget.showProfile(response.data)
	}
})

const ratesBoard = new RatesBoard()
const receivingExchangeRates = () => {
	ApiConnector.getStocks(response => {
		if (response.success) {
			ratesBoard.clearTable()
			ratesBoard.fillTable(response.data)
		}
	})
}

receivingExchangeRates()
setInterval(receivingExchangeRates, 60000)

const moneyManager = new MoneyManager()
function actionsToMoney(response, message) {
	if (!response.success) {
		moneyManager.setMessage(false, response.error)
		return
	}

	ProfileWidget.showProfile(response.data)
	moneyManager.setMessage(true, message)
}

moneyManager.addMoneyCallback = data => {
	ApiConnector.addMoney(data, response => actionsToMoney(response, "Пополнение счёта прошло успешно!"))
}

moneyManager.conversionMoneyCallback = data => {
	ApiConnector.convertMoney(data, response => actionsToMoney(response, "Конвертация прошла успешно!"))
}

moneyManager.sendMoneyCallback = data => {
	ApiConnector.transferMoney(data, response => actionsToMoney(response, "Перевод средств прошёл успешно!"))
}

const favoritesWidget = new FavoritesWidget()
function actionsToFavorites(response, message) {
	if (!response.success) {
		favoritesWidget.setMessage(false, response.error)
		return
	}
	favoritesWidget.clearTable()
	favoritesWidget.fillTable(response.data)
	moneyManager.updateUsersList(response.data)
	favoritesWidget.setMessage(true, message)
}

ApiConnector.getFavorites(response => {
	if (response.success) {
		favoritesWidget.clearTable()
		favoritesWidget.fillTable(response.data)
		moneyManager.updateUsersList(response.data)
	}
})

favoritesWidget.addUserCallback = data => {
	ApiConnector.addUserToFavorites(data, response => actionsToFavorites(response, "Пользователь добавлен в избранное!"))
}

favoritesWidget.removeUserCallback = data => {
	ApiConnector.removeUserFromFavorites(data, response => actionsToFavorites(response, "Пользователь удалён из избранного!"))
}