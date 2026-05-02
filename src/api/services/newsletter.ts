import { apiClient } from "../client"
import { endpoints } from "../endpoints"
import type {
  NewsletterSubscriptionRequest,
  NewsletterSubscriptionResponse,
} from "../types"

/**
 * Inscreve um e-mail na newsletter (double opt-in: o backend dispara um
 * e-mail de confirmação antes de efetivar a inscrição).
 *
 * @route POST /newsletter/subscribe
 * @throws {ApiError} 409 se o e-mail já estiver inscrito.
 * @throws {ApiError} 422 se o e-mail for inválido.
 */
export async function subscribeToNewsletter(
  payload: NewsletterSubscriptionRequest,
): Promise<NewsletterSubscriptionResponse> {
  const { data } = await apiClient.post<NewsletterSubscriptionResponse>(
    endpoints.newsletterSubscribe(),
    payload,
  )
  return data
}
