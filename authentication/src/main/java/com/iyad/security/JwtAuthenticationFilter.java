package com.iyad.security;

import com.iyad.service.UserService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            authenticateUser(request);
        } catch (JwtException | AuthenticationException e) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Forbidden: Invalid or expired token");
            return;
        }

        String fullPath = request.getRequestURI();
        String contextPath = request.getContextPath();

        if (fullPath.contains("api")) {
            HttpServletRequest modifiedRequest = extractProjectAndWrapRequest(request, fullPath, contextPath);
            try {
                filterChain.doFilter(modifiedRequest, response);
            } finally {
                ProjectContext.clear();
            }
        } else {
            try {
                filterChain.doFilter(request, response);
            } finally {
                ProjectContext.clear();
            }
        }
    }

    private void authenticateUser(HttpServletRequest request) {
        String jwt = getJwtFromRequest(request);
        if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
            String username = tokenProvider.getUsernameFromJWT(jwt);
            var userDetails = userService.loadUserByUsername(username);
            var authentication = new UsernamePasswordAuthenticationToken(
                    userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);
        }
    }

    private HttpServletRequest extractProjectAndWrapRequest(HttpServletRequest request, String fullPath, String contextPath) {
        String remainingPath = fullPath.substring(contextPath.length()+1);
        String[] parts = remainingPath.split("/", 2);

        if (parts.length == 2) {
            try {
                UUID projectId = UUID.fromString(parts[0]);
                ProjectContext.set(projectId);

                String newPath = (parts.length == 2) ? "/" + parts[1] : "/";
                return wrapRequestWithNewPath(request, contextPath + newPath);
            } catch (IllegalArgumentException e) {
                // Invalid UUID; let original request proceed without project context
            }
        }
        return request;
    }

    private HttpServletRequest wrapRequestWithNewPath(HttpServletRequest request, String newPath) {
        return new HttpServletRequestWrapper(request) {
            @Override
            public String getRequestURI() {
                return newPath;
            }

            @Override
            public String getServletPath() {
                return newPath;
            }
        };
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer "))
                ? bearerToken.substring(7)
                : null;
    }
}
