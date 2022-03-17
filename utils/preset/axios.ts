import { message } from 'antd'
import axios from 'axios'

import { history } from '@umijs/pro'

axios.interceptors.request.use((config) => {
	const session = `Bearer ${sessionStorage.getItem('token')}` || ''

	return {
		...config,
		headers: {
			...config['headers'],
			authorization: session
		}
	}
})

axios.interceptors.response.use(
	(response) => response.data,
	(error) => {
		const res = error.response
		const data = res.data

		if (data && data.message) {
			message.error(data.message)
		} else {
			if (res.status && res.statusText)
				message.error(`${res.status} : ${res.statusText}`)
		}

		if (data && data.code === 401) {
			const login_url = localStorage.getItem('login_url')

			if (login_url) history.push(login_url)
		}

		return Promise.reject(error)
	}
)