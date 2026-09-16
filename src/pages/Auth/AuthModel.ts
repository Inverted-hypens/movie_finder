import {
	loginUser,
	logoutUser,
	registerUser,
} from '../../services/authService'
import type { User } from 'firebase/auth'

function validateCredentials(email: string, password: string) {
	if (!email) {
		throw new Error('Email is required.')
	}

	if (!password) {
		throw new Error('Password is required.')
	}

	if (password.length < 6) {
		throw new Error('Password must be at least six characters.')
	}
}

function normalizeEmail(email: string) {
	return email.trim().toLowerCase()
}

export async function register(
	email: string,
	password: string,
): Promise<User> {
	const normalizedEmail = normalizeEmail(email)
	validateCredentials(normalizedEmail, password)
	const credential = await registerUser(normalizedEmail, password)
	return credential.user
}

export async function login(email: string, password: string): Promise<User> {
	const normalizedEmail = normalizeEmail(email)
	validateCredentials(normalizedEmail, password)
	const credential = await loginUser(normalizedEmail, password)
	return credential.user
}

export async function logout(): Promise<void> {
	return logoutUser()
}
