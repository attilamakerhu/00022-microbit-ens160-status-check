let speed = 20000
let old_time = control.millis()
ENS160.Address(ENS160_I2C_ADDRESS.ADDR_0x52)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
ENS160.SetHumidity(BME280.humidity())
ENS160.SetTemp(BME280.temperature(BME280_T.T_C))
serial.redirectToUSB()
basic.forever(function () {
	
})
