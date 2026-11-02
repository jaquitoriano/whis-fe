---
name: user-management
description: Build full-stack user management applications using Python for the API and Next.js for the interface, leveraging PostgreSQL-native identity, configuration, user groups, and permission roles (authn, authz ReBAC, config). Use when designing or implementing authentication, authorization, sessions, configuration, user groups, and role-based access.
---

# PostgreSQL & Python & Next.js User Management System

A comprehensive guide for building a production-grade user management application with a Python API, Next.js frontend, and a PostgreSQL-native core handling identity, configuration, user groups, and permission roles through SQL functions.

## Architecture Overview

1. **Database Layer (PostgreSQL Core)**:
   - **Authn**: User accounts, sessions, password hashing, MFA (TOTP), and password reset tokens implemented through SQL functions.
   - **Authz (ReBAC)**: User groups, group memberships, permission roles, role assignments, direct permissions, and relationship-based access checks.
   - **Config**: Versioned key-value storage for tenant, user, and system preferences.

2. **API Layer (Python)**:
   - Use FastAPI or another lightweight async Python framework with `asyncpg` or `psycopg`.
   - Expose REST endpoints that call PostgreSQL functions.
   - Validate sessions and inject user and tenant context into every request.

3. **Frontend Layer (Next.js)**:
   - Authentication routes under `/auth`.
   - User dashboard under `/dashboard` or `/profile`.
   - User management under `/users`.
   - Group management under `/groups`.
   - Permission-role management under `/roles`.
   - Configuration management under `/settings`.
   - Use Server Components for protected reads and Server Actions or API routes for mutations.

## Core Modules & Implementation Guide

### 1. Authentication & Session Management (Authn)

- **Database Functions**:
  - `auth.sign_up(email, password, display_name)`
  - `auth.sign_in(email, password)`
  - `auth.verify_mfa(user_id, code)`
  - `auth.logout(session_id)`
  - `auth.reset_password(token, password)`
- **API Endpoints**:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `POST /api/auth/logout`
  - `POST /api/auth/mfa/verify`
  - `POST /api/auth/reset-password`
- **Frontend**:
  - Login, signup, MFA verification, password reset, and logout flows.
  - Store authenticated identity in the API's secure session cookie, not local storage.
  - Redirect users without a valid session to `/auth/login`.

### 2. User Groups

- **Database Functions**:
  - `authz.create_group(tenant_id, name, description)`
  - `authz.update_group(group_id, name, description)`
  - `authz.delete_group(group_id)`
  - `authz.add_group_member(group_id, user_id)`
  - `authz.remove_group_member(group_id, user_id)`
  - `authz.list_group_members(group_id)`
- **API Endpoints**:
  - `GET /api/groups`
  - `POST /api/groups`
  - `GET /api/groups/{group_id}`
  - `PUT /api/groups/{group_id}`
  - `DELETE /api/groups/{group_id}`
  - `GET /api/groups/{group_id}/members`
  - `POST /api/groups/{group_id}/members`
  - `DELETE /api/groups/{group_id}/members/{user_id}`
- **Frontend**:
  - Display a searchable group directory.
  - Show group name, description, member count, and assigned roles.
  - Provide member search, add-member, and remove-member actions.
  - Prevent deletion when dependencies require confirmation.

### 3. Permission Roles

- **Database Functions**:
  - `authz.create_role(tenant_id, name, permissions)`
  - `authz.update_role(role_id, name, permissions)`
  - `authz.delete_role(role_id)`
  - `authz.assign_role_to_group(group_id, role_id)`
  - `authz.remove_role_from_group(group_id, role_id)`
  - `authz.list_roles_for_group(group_id)`
  - `authz.list_effective_permissions(user_id, tenant_id)`
- **API Endpoints**:
  - `GET /api/roles`
  - `POST /api/roles`
  - `GET /api/roles/{role_id}`
  - `PUT /api/roles/{role_id}`
  - `DELETE /api/roles/{role_id}`
  - `POST /api/groups/{group_id}/roles/{role_id}`
  - `DELETE /api/groups/{group_id}/roles/{role_id}`
  - `GET /api/users/{user_id}/permissions`
- **Frontend**:
  - Create named roles containing permission identifiers.
  - Assign and remove roles for each user group.
  - Show each user's direct groups, inherited roles, and effective permissions.
  - Use permission checks to hide unauthorized navigation and controls.

### 4. Relationship-Based Access Control (Authz / ReBAC)

- **Database Functions**:
  - `authz.check_permission(user_id, resource_id, action)`
  - `authz.check_permission_in_tenant(user_id, tenant_id, action)`
  - `authz.grant_role(subject_id, resource_id, relation)`
- **API Endpoints**:
  - `GET /api/permissions/check`
  - `POST /api/permissions/grant`
- **Frontend**:
  - Run permission checks from middleware, layout guards, and server actions.
  - Show clear unauthorized states.
  - Do not rely only on hidden controls; enforce permissions in the API and database.

### 5. Profile and Account Management

- **Database Functions**:
  - `auth.update_profile(user_id, display_name)`
  - `auth.change_password(user_id, current_password, new_password)`
- **API Endpoints**:
  - `GET /api/users/me`
  - `PUT /api/users/me/profile`
  - `PUT /api/users/me/password`
- **Frontend**:
  - User profile page with display name and email.
  - Password update form with current and new password fields where supported.
  - Group memberships and effective roles in read-only account views.

### 6. Versioned Configuration (Config)

- **Database Functions**:
  - `config.get(key, version)`
  - `config.set(key, value)`
- **API Endpoints**:
  - `GET /api/config`
  - `PUT /api/config`
- **Frontend**:
  - Render typed configuration editors under `/settings`.
  - Show scope, key, current value, and version when available.

## Authorization Model

- A user can belong to multiple groups.
- A group can inherit multiple permission roles.
- A role contains one or more named permissions.
- A user's effective permissions are the union of all role permissions inherited through their groups.
- A tenant or workspace ID scopes users, groups, roles, memberships, and permission checks.
- Resolve effective permissions in one PostgreSQL function so API and UI behavior remain consistent.
- Enforce authorization at the database and API layers even when controls are hidden in Next.js.

## Best Practices & Conventions

- Encapsulate business logic in PostgreSQL functions where transaction guarantees and authorization consistency matter.
- Let Python handle HTTP routing, validation, serialization, session middleware, and PostgreSQL exception mapping.
- Let Next.js handle forms, client state, layouts, navigation, and permission-aware presentation.
- Standardize API errors as:
  `{"error":{"code":"...","message":"..."}}`
- Maintain shared TypeScript interfaces matching Python models and PostgreSQL rows.
- Use transactions for group member and role assignment operations.
- Audit group membership changes, role changes, and permission grants.

## Frontend Implementation Plan

### Route structure

- `/auth/login`: authenticate with email and password.
- `/auth/signup`: create an account with email and password.
- `/auth/mfa`: verify the six-digit MFA code using the returned `user_id`.
- `/auth/reset`: reset a password using a signed reset token.
- `/profile`: display and update the current profile and password.
- `/users`: search users, inspect effective access, check permissions, and grant relationships.
- `/groups`: list groups, create and edit groups, and manage group membership.
- `/roles`: create and edit named permission roles, assign permissions, and assign roles to groups.
- `/settings`: read and publish versioned configuration values.

### Navigation

- Use one authenticated application shell for Dashboard, Users, Groups, Roles, Profile, and Configuration.
- Remove meter, billing, queue, and job navigation.
- Keep Authentication links available for login, MFA, signup, logout, and password recovery.
- Show group and role controls only after an API permission check succeeds.

### Data integration

- Use `/api/auth/*` for session and password operations.
- Use `/api/permissions/check` and `/api/permissions/grant` for the authorization operations currently published by the deployed API.
- Use `/api/config` for profile display-name preferences and system configuration.
- Implement `/api/groups/*` and `/api/roles/*` only when the Python API publishes the corresponding OpenAPI paths.
- Do not fabricate client-side groups, roles, memberships, or effective permissions.
- Do not treat an error response or unauthenticated session as successful data.

### Group management screen

- Query the tenant-scoped group list.
- Search groups by name.
- Create a group with a name and optional description.
- Open a group detail panel showing members and assigned roles.
- Add or remove members through the group's member endpoints.
- Show loading, empty, forbidden, and API error states.

### Role management screen

- Query tenant-scoped roles.
- Create roles with a name and a list of permission identifiers.
- Edit a role's name and permission identifiers.
- Delete roles only after dependency confirmation.
- Assign roles to groups through the group-role endpoints.
- Remove group-role assignments without deleting the role.

### Per-user access screen

- Show the user's membership in each group.
- Show role assignments inherited through those groups.
- Show effective permissions as the union of inherited role permissions.
- Check permissions against resource and action identifiers.
- Prefer the API's effective-permission response when available instead of computing authorization in the browser.

### Current API compatibility

- The existing deployment OpenAPI currently contains authentication, authorization, configuration, health, metering, and jobs.
- Metering and jobs are not part of the user-management frontend plan and must be removed from navigation and screens.
- Group and role CRUD endpoints are part of the backend implementation plan but are not currently exposed by the deployed OpenAPI and therefore cannot be populated from live API data yet.
