package com.ssafy.dingdong.global.oauth.handler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ssafy.dingdong.domain.member.entity.Member;
import com.ssafy.dingdong.domain.member.repository.MemberRepository;
import com.ssafy.dingdong.global.oauth.model.PrincipalUser;
import com.ssafy.dingdong.global.oauth.model.ProviderUser;
import com.ssafy.dingdong.global.util.CookieUtils;
import com.ssafy.dingdong.global.util.JwtProvider;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Component
@RequiredArgsConstructor
public class CustomOAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private static final String REDIRECT_ENDPOINT = "https://k9b203.p.ssafy.io";

	private final MemberRepository memberRepository;
	private final JwtProvider jwtProvider;
	private final CookieUtils cookieUtils;

	private String redirectUrl;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws
		IOException {
		PrincipalUser principalUser = (PrincipalUser)authentication.getPrincipal();
		ProviderUser providerUser = principalUser.getProviderUser();

		memberRepository.findByEmail(providerUser.getEmail()).ifPresentOrElse(
			findMember -> {
				// 탈퇴한 회원일 때
				// Todo : UUID를 전달해주는게 맞는가?
				if (findMember.getExitTime() != null) {
					redirectUrl = REDIRECT_ENDPOINT + "/rejoin" + findMember.getMemberId();
				}else {
					String accessToken = jwtProvider.createAccessToken(findMember);
					String refreshToken = jwtProvider.createRefreshToken();

					Cookie cookie = cookieUtils.createCookie(refreshToken);
					response.addCookie(cookie);
					redirectUrl = REDIRECT_ENDPOINT + "/oauth2/redirect?token=" + accessToken;
				}
			},
			// 비회원일 경우
			() -> {
				log.info("=== Social Login !! ===");
				Member member = Member.builder()
					.provider(providerUser.getProvider())
					.email(providerUser.getEmail())
					.createTime(LocalDateTime.now()).build();
				memberRepository.save(member);
				redirectUrl = REDIRECT_ENDPOINT + "/signup?memberId=" + member.getMemberId();
			}
		);
		getRedirectStrategy().sendRedirect(request, response, redirectUrl);
	}
}