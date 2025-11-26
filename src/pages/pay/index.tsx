import { useState } from "react"
import { WalletConnect } from "../../components/WalletConnect"
import axiosInstance from "../../lib/axios"
import { atomWithQuery } from "jotai-tanstack-query"
import { useAtomValue } from "jotai"
import { apiUrl } from "../../lib/constants/api"

export const preOrderDetailAtom = atomWithQuery(() => ({
	queryKey: [apiUrl.preOrderDetailsApi],
	queryFn: async () => {
		const params = new URLSearchParams(window.location.search)
		const preSn = params.get('preSn')
		const res = await axiosInstance.post(apiUrl.preOrderDetailsApi, {
			preSn: preSn,
		});
		console.log(res.data);
		return res.data;
	}
}))



export default function Pay() {
	const { data: preOrderDetail, isLoading } = useAtomValue(preOrderDetailAtom)

	const [isPaymentSuccess, setIsPaymentSuccess] = useState(false)

	if (isLoading) return null

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			alignItems: 'center',
			minHeight: '100vh',
			fontFamily: 'Arial, sans-serif',
			gap: '16px',
			padding: '16px',
			paddingTop: '60px',
			boxSizing: 'border-box',
			backgroundColor: '#F5F5F5'
		}}>
			{!isPaymentSuccess && (
				<div style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: '12px',
					width: '100%',
					maxWidth: '500px'
				}}>
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 16px',
						boxSizing: 'border-box',
						width: '100%',
						maxWidth: '500px'
					}}>
						<label style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							Total Amount: {preOrderDetail.orderAmount}
						</label>
						<span style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							USD
						</span>
					</div>

					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 16px',
						boxSizing: 'border-box',
						width: '100%',
						maxWidth: '500px'
					}}>
						<label style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							Pay With Crypto: {preOrderDetail.digitalAmount}
						</label>
						<span style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							USDT
						</span>
					</div>

					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						padding: '0 16px',
						boxSizing: 'border-box',
						width: '100%',
						maxWidth: '500px'
					}}>
						<label style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							Rate: 
						</label>
						<span style={{
							fontSize: 'clamp(14px, 4vw, 16px)',
							fontWeight: 'bold',
							whiteSpace: 'nowrap'
						}}>
							1 USD = {preOrderDetail.rate} USDT
						</span>
					</div>
				</div>
			)}
			<WalletConnect amount={preOrderDetail.digitalAmount} onPaymentSuccess={setIsPaymentSuccess} />
		</div>
	)
}