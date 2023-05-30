import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA

data = pd.read_csv('Weather.csv')
data['AVG_TEMP'] = data.iloc[:, 1:].apply(lambda row: sum(row)/12, axis=1)
data['AVG_TEMP'] = round(data['AVG_TEMP'], 2)
data.set_index('YEAR', inplace=True)
data.index = pd.to_datetime(data.index, format='%Y')

plt.figure(figsize=(10,5))
plt.plot(data['AVG_TEMP'], label='Temperature')
plt.xlabel('Year')
plt.ylabel('Temperature (°C)')
plt.title('Average Temperature in India (All Months)')
plt.legend()
plt.show()

model = ARIMA(data['AVG_TEMP'], order=(1 ,1, 1))
result = model.fit()
forecast = result.forecast(steps=10)

plt.figure(figsize=(10,5))
plt.plot(data['AVG_TEMP'], label='Actual')
plt.plot(forecast, label='Forecast')
plt.xlabel('Year')
plt.ylabel('Temperature (°C)')
plt.title('Average Temperature in India (All Months)')
plt.legend()
plt.show()

print('Forecasted temperature for the next 5 years:')
print(forecast.tail(5))
print('Accuracy of the model:')
print(result.summary())


