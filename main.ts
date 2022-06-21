function blink (image: Image, animation_speed: number) {
    if (control.millis() - animoldtime > animation_speed) {
        animoldtime = control.millis()
        if (image_switch == 0) {
            image.showImage(0)
            image_switch = 1
        } else {
            basic.clearScreen()
            image_switch = 0
        }
    }
}
function collect_ens160_data () {
    eco2 = ENS160.eCO2()
    voc = ENS160.TVOC()
    ens160_status = ENS160.Status()
}
function defining_satus_images () {
    image_no_valid_input = images.createImage(`
        # . . . #
        . # . # .
        . . # . .
        . # . # .
        # . . . #
        `)
    image_initial_startup = images.createImage(`
        # # # . .
        . . . # .
        . # # . .
        # . . . .
        # # # # .
        `)
    image_warmup = images.createImage(`
        . . # . .
        . # # . .
        . . # . .
        . . # . .
        . # # # .
        `)
    image_operating_ok = images.createImage(`
        . # # . .
        # . . # .
        # . . # .
        # . . # .
        . # # . .
        `)
    image_waiting_for_ens160 = images.createImage(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
}
let image_waiting_for_ens160: Image = null
let image_operating_ok: Image = null
let image_warmup: Image = null
let image_initial_startup: Image = null
let image_no_valid_input: Image = null
let voc = 0
let eco2 = 0
let image_switch = 0
let animoldtime = 0
let ens160_status: ENS160_STATUS = null
defining_satus_images()
// This value determines the time between to measurements in milliseconds. The minimum suggested value is 1000.
let speed = 10000
let old_time = control.millis()
ens160_status = 100
ENS160.Address(ENS160_I2C_ADDRESS.ADDR_0x53)
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x77)
ENS160.SetHumidity(BME280.humidity())
ENS160.SetTemp(BME280.temperature(BME280_T.T_C))
serial.redirectToUSB()
basic.forever(function () {
    if (control.millis() - old_time > speed) {
        collect_ens160_data()
        old_time = control.millis()
    }
    if (ens160_status == 100) {
        blink(image_waiting_for_ens160, 400)
        serial.writeLine("Waiting for ENS160 data...")
    } else if (ens160_status == 0) {
        blink(image_operating_ok, 400)
        serial.writeLine("STATUS_FLAG=0, Operating ok")
    } else if (ens160_status == 400) {
        blink(image_warmup, 400)
        serial.writeLine("STATUS_FLAG=1, Warm-up")
    } else if (ens160_status == 2) {
        blink(image_initial_startup, 400)
        serial.writeLine("STATUS_FLAG=2, Initial Start-up")
    } else if (ens160_status == 3) {
        serial.writeLine("STATUS_FLAG=3, No valid output")
        blink(image_no_valid_input, 400)
    } else {
        serial.writeLine("Invalid STATUS_FLAG value. Seek help!")
        basic.showString("ERROR")
    }
})
