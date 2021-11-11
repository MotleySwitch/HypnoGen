import React from "react"
import { buttplugInit, ButtplugClient, ButtplugClientDevice, ButtplugEmbeddedConnectorOptions } from "buttplug"

const ButtplugContext = React.createContext<{
	readonly client: ButtplugClient | null
	readonly devices: readonly ButtplugClientDevice[]
	readonly scanning: boolean
	readonly scan: () => void
	readonly vibration: number
	readonly vibrate: (value: number) => void
}>({
	client: null,
	devices: [],
	scanning: false,
	scan: () => { },
	vibrate: _ => { },
	vibration: 0
})

export const useButtplugScan = (): [boolean, () => void] => [React.useContext(ButtplugContext).scanning, React.useContext(ButtplugContext).scan]

export const useButtplugVibrate = (): [number, (value: number) => void] => [React.useContext(ButtplugContext).vibration, React.useContext(ButtplugContext).vibrate]

export const useButtplugDevices = () => React.useContext(ButtplugContext).devices

export const useButtplugClient = () => React.useContext(ButtplugContext).client

export const ButtplugProvider = ({ children }: { children: React.ReactChild }) => {
	const [client, setClient] = React.useState<ButtplugClient | null>(null)
	const [devices, setDevices] = React.useState<readonly ButtplugClientDevice[]>([])
	const [scanning, setScanning] = React.useState(false)
	const [vibration, vibrate] = React.useState(0)

	React.useEffect(() => {
		(async function () {
			await buttplugInit()
			const client = new ButtplugClient("Hypnogen")
			client.addListener("deviceadded", device => setDevices(items => [...items, device]))
			client.addListener("deviceremoved", device => setDevices(items => items.filter(i => i !== device)))
			client.addListener("scanningfinished", () => setScanning(false));
			setClient(client)

			client.connect(new ButtplugEmbeddedConnectorOptions())
		})()
	}, [])

	React.useEffect(() => {
		devices.forEach(device => {
			device.vibrate(vibration)
		})
	}, [vibration, devices])

	const scan = React.useMemo(() => client != null ? () => {
		setScanning(true)
		client.startScanning()
	} : () => { }, [client])

	return (
		<ButtplugContext.Provider value={{ client, devices, scanning, scan, vibration, vibrate }}>
			{children}
		</ButtplugContext.Provider>
	)
}
