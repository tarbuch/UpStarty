# UpStarty — Frontend Product Requirements Document (PRD)

## 1. Product Overview

### Product Name

**UpStarty**

### Product Tagline

**Pilot. Validate. Scale.**

### Product Category

Government Innovation Procurement Operating System

### Product Purpose

UpStarty is a two-sided digital platform connecting government departments that have operational problems with eligible startups that can provide innovative solutions.

The platform manages the complete innovation-procurement lifecycle:

**Government Problem → Structured Challenge → Startup Discovery → Eligibility → Expert Evaluation → Pilot → KPI Measurement → Independent Validation → Procurement/Scale Decision**

The frontend must communicate that UpStarty is **not merely a startup directory, tender portal, application portal, or AI chatbot**. It is an end-to-end innovation procurement operating system.

---

# 2. Product Goals

The frontend must allow:

1. Government departments to define operational problems.
2. Government officers to convert rough problems into structured outcome-based challenges.
3. Startups to discover relevant government opportunities.
4. The system to recommend suitable startups using semantic matching.
5. Government users to verify startup eligibility.
6. Experts to independently evaluate applications.
7. Government users to create and manage controlled pilots.
8. Both sides to track pilot milestones.
9. KPI performance to be measured against predefined baselines and targets.
10. Pilot evidence to be submitted and independently validated.
11. Government users to make Scale / Extend / Stop decisions.
12. Successful pilot evidence to be reused by other departments.
13. Important actions and decisions to remain auditable.

These requirements directly follow the supplied PS.

---

# 3. Primary User Roles

The frontend must support five roles.

## 3.1 Government Officer

Primary responsibilities:

* Create challenges
* Define requirements
* Configure eligibility
* Discover startups
* Review applications
* Review expert evaluations
* Create pilots
* Track KPIs
* Track milestones/payments
* Review validation
* Make authorized scale decisions
* View audit history

---

## 3.2 Startup

Primary responsibilities:

* Create startup profile
* Maintain Procurement Passport
* Discover challenges
* Check eligibility
* Apply to challenges
* Track application status
* Participate in pilots
* Submit KPI evidence
* Track milestones
* Track payment status

---

## 3.3 Expert

Primary responsibilities:

* View assigned applications
* Review proposals
* Score configurable evaluation criteria
* Add comments
* Submit independent evaluation

Experts do not make the final procurement decision.

---

## 3.4 Validator

Primary responsibilities:

* Review pilot evidence
* Review KPI results
* Verify methodology
* Validate/reject results
* Add validation comments

---

## 3.5 Admin

Primary responsibilities:

* Manage users
* Manage departments
* Manage challenge configuration
* Manage eligibility rules
* Manage evaluation criteria
* View audit events
* Manage platform-level settings

---

# 4. Frontend Information Architecture

## Common

* Landing Page
* Login
* Registration
* Forgot Password
* Notifications
* Profile
* Settings
* Help

## Government

* Dashboard
* Challenges
* Create Challenge
* AI Problem Builder
* Startup Discovery
* Startup Details
* Applications
* Application Details
* Evaluations
* Pilots
* Pilot Details
* KPI & Performance
* Milestones & Payments
* Validations
* Scale Decisions
* Evidence Library
* Audit Trail

## Startup

* Dashboard
* Discover Challenges
* Challenge Details
* My Applications
* Application Details
* Procurement Passport
* Documents
* My Pilots
* KPI & Evidence
* Milestones
* Payments
* Notifications

## Expert

* Dashboard
* Assigned Evaluations
* Evaluation Details
* Completed Evaluations

## Validator

* Dashboard
* Pending Validations
* Validation Details
* Completed Validations

## Admin

* Dashboard
* Users
* Departments
* Challenges
* Eligibility Rules
* Evaluation Criteria
* Audit Logs
* Settings

---

# 5. Global Design System

## 5.1 Design Direction

The interface should feel:

* Government-grade
* Professional
* Trustworthy
* Modern
* Clean
* Data-driven
* Accessible
* Enterprise-ready

It should not look like a generic startup social network.

---

## 5.2 Layout

Desktop-first application with responsive support.

Recommended structure:

```text
┌─────────────────────────────────────────────────────┐
│ Top Bar                                              │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│ Sidebar      │ Main Content                         │
│              │                                      │
│ Navigation   │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

---

## 5.3 Global UI Components

The design system should provide reusable:

* Button
* Input
* Textarea
* Select
* Multi-select
* Date picker
* Currency input
* File upload
* Search
* Filter
* Tabs
* Cards
* Tables
* Badges
* Status indicators
* Modal
* Drawer
* Tooltip
* Dropdown
* Pagination
* Stepper
* Progress bar
* Timeline
* Chart
* Empty state
* Loading state
* Error state
* Confirmation dialog
* Toast notification

---

# 6. Global Navigation

The sidebar must change based on user role.

The current user identity must always be visible.

Example:

```text
UPSTARTY

Government Portal

Dashboard
Challenges
Startups
Applications
Evaluations
Pilots
Performance
Payments
Validations
Evidence
Audit Trail

────────────────

Profile
Settings
Logout
```

The active navigation item must be visually distinguishable.

---

# 7. Authentication

## 7.1 Login Screen

Fields:

* Email
* Password
* Remember me

Actions:

* Login
* Forgot password
* Create account

Optional demo mode:

```text
Continue as Government
Continue as Startup
Continue as Expert
Continue as Validator
```

For hackathon demonstration, role-based demo accounts may be provided.

---

# 8. Landing Page

The landing page must immediately communicate the product story.

## Hero

Headline:

**From Government Problems to Scalable Innovation.**

Subheadline:

**UpStarty connects government challenges with capable startups and manages the journey from pilot to validated scale.**

Primary CTA:

**Explore Platform**

Secondary CTA:

**How It Works**

---

## Lifecycle Visualization

```text
Problem
   ↓
Challenge
   ↓
Match
   ↓
Eligibility
   ↓
Evaluation
   ↓
Pilot
   ↓
KPI
   ↓
Validation
   ↓
Scale
```

---

## Three Core Value Propositions

### AI-Assisted Challenges

Convert vague operational problems into measurable challenges.

### Explainable Startup Matching

Find suitable startups based on capabilities, domain experience and readiness.

### Pilot-to-Scale Management

Track KPIs, evidence, validation and scale decisions in one workflow.

These three areas are explicitly identified as the strongest features in the supplied PS.

---

# 9. Government Dashboard

This is the primary Government landing screen.

## Header

Display:

* Department name
* Officer name
* Notifications
* Current date

---

## KPI Cards

Required cards:

* Active Challenges
* Applications
* Pending Evaluations
* Active Pilots
* Pending Validations
* Pending Decisions

Example:

```text
Active Challenges
12
+3 this month
```

---

## Challenge Pipeline

Display:

```text
Draft
   ↓
Open
   ↓
Evaluation
   ↓
Pilot
   ↓
Validation
   ↓
Decision
```

Each stage should show count.

---

## Active Pilots

Card/table showing:

* Pilot
* Startup
* Location
* Progress
* KPI status
* Days remaining

---

## Pending Actions

Examples:

* 4 applications awaiting review
* 2 expert evaluations pending
* 1 validation pending
* 2 milestone approvals pending
* 1 scale decision pending

---

## Recent Activity

Timeline:

```text
Challenge created
Startup shortlisted
Expert evaluation submitted
Pilot KPI updated
Validation completed
Scale decision approved
```

---

# 10. Challenge Management

## Challenge List

Columns:

* Challenge ID
* Challenge title
* Department
* Domain
* Status
* Applications
* Deadline
* Created date
* Actions

Statuses:

* Draft
* Published
* Applications Open
* Evaluation
* Startup Selected
* Pilot
* Completed
* Closed

---

## Filters

* Status
* Domain
* Department
* Location
* Date
* Budget range

---

## Search

Search by:

* Challenge title
* Challenge ID
* Domain
* Keyword

---

# 11. Create Challenge

The challenge creation experience should be a multi-step wizard.

## Step 1 — Problem

Fields:

* Challenge title
* Problem description
* Department
* Domain
* Location

The problem description may initially be unstructured.

CTA:

**Use AI to Structure Problem**

---

# 12. AI Problem Builder

This is one of the most important screens.

## Input

Government officer enters:

> "Our municipal waste collection routes are inefficient and citizens are complaining about missed pickups."

---

## AI Processing State

Display:

```text
Analyzing problem...
Extracting requirements...
Identifying measurable outcomes...
Generating success criteria...
```

---

## AI Output

### Structured Problem

Show:

* Problem
* Objective
* Expected outcome
* Suggested scope
* Suggested KPIs
* Suggested timeline
* Suggested success criteria

Example:

```text
Problem
Inefficient municipal waste collection routing.

Objective
Optimize waste collection routes.

Expected Outcome
Reduce missed pickups and unnecessary route distance.

Suggested KPIs
• Missed pickups
• Citizen complaints
• Average route distance
• Collection efficiency
```

Actions:

**Accept**

**Edit**

**Regenerate**

**Discard**

AI output must always remain editable by the government user.

AI does not publish the challenge automatically.

---

# 13. Challenge Creation — Objective

Fields:

* Objective
* Expected outcome
* Target population
* Operational scope

The frontend should provide helper text explaining the difference between an objective and measurable outcome.

---

# 14. Challenge Creation — Budget & Timeline

Fields:

* Estimated budget
* Maximum pilot budget
* Application opening date
* Application deadline
* Pilot duration
* Expected start date

Validation:

* Budget cannot be negative.
* Deadline cannot precede opening date.
* Pilot duration must be positive.

---

# 15. Challenge Creation — Success Criteria

This screen must support multiple KPIs.

Each KPI:

```text
KPI Name
Baseline
Target
Unit
Measurement Method
Evidence Required
```

Example:

```text
KPI:
Missed Waste Pickups

Baseline:
100/month

Target:
75/month

Unit:
Pickups

Measurement:
Monthly municipal records
```

Government must be able to add/remove KPI rows.

---

# 16. Challenge Creation — Eligibility

Eligibility rules must be configurable per challenge.

Possible fields:

* Registration/recognition requirement
* Required documents
* Certifications
* Legal status
* Conflict-of-interest declaration
* Pilot readiness

Each requirement should support:

```text
Required / Optional
```

The PS explicitly requires configurable eligibility rules.

---

# 17. Challenge Creation — Review & Publish

Final preview must show:

* Problem
* Objective
* Expected outcome
* Budget
* Timeline
* Eligibility
* Evaluation criteria
* KPIs
* Success criteria

Actions:

**Save Draft**

**Edit**

**Publish Challenge**

Before publishing, show confirmation:

> Once published, the challenge will become visible to eligible startups.

---

# 18. Challenge Details

Government challenge detail page:

Header:

* Challenge title
* Status
* Department
* Domain
* Location
* Budget
* Timeline

Tabs:

```text
Overview
Requirements
Eligibility
Applications
Matches
Evaluations
Pilot
Audit
```

---

# 19. Startup Discovery

Government can search the startup database.

Search:

```text
Search startups by name, capability, technology...
```

Filters:

* Domain
* Technology
* Location
* Maturity
* Previous deployment
* Government deployment
* Pilot readiness
* Eligibility status

---

# 20. AI Startup Matching

For each challenge, provide:

**Find Matching Startups**

The system should:

1. Extract challenge requirements.
2. Generate challenge representation.
3. Search startup profiles.
4. Apply eligibility filter.
5. Rank compatible startups.
6. Explain recommendations.

This workflow is explicitly defined by the PS.

---

# 21. Matching Results Screen

Header:

```text
Recommended Startups
For: Waste Management Optimization
```

Cards:

```text
EcoRoute AI

94% Match

Technology Fit     High
Domain Experience  High
Past Deployment    Yes
Pilot Readiness    High

[View Match Analysis]
[View Startup]
```

---

# 22. Explainable Match Analysis

Never display only:

```text
94% Match
```

Display reasons.

Example:

```text
Why this startup?

✓ Strong waste-management domain experience
✓ Existing route optimization capability
✓ Previous municipal deployment
✓ Pilot-ready team
✓ Similar problem previously solved
```

Also display component scores:

```text
Technology Fit       96%
Domain Experience    94%
Previous Deployment  90%
Pilot Readiness      95%
```

The exact weights can be configured by the implementation; the PS requirement is that recommendations be explainable rather than score-only.

---

# 23. Startup Detail

Government-facing startup profile must show:

* Startup name
* Description
* Logo
* Sector
* Technologies
* Capabilities
* Locations
* Maturity
* Pilot readiness
* Previous deployments
* Government deployments
* Certifications
* Documents

Tabs:

```text
Overview
Capabilities
Deployments
Certifications
Documents
Procurement Passport
Match Analysis
```

---

# 24. Eligibility Screening

Eligibility screen must display every configured requirement.

Example:

```text
Startup: EcoRoute AI

✓ Registration
✓ Required Documents
✓ Certification
✓ Legal Status
✓ Conflict Declaration
✓ Pilot Readiness

STATUS
ELIGIBLE
```

Failed checks:

```text
✗ Required Certification

Reason:
Mandatory certification not provided.
```

Actions:

**Approve Eligibility**

**Reject**

**Request Clarification**

---

# 25. Application Management

Government application table:

Columns:

* Startup
* Match Score
* Eligibility
* Proposal Status
* Expert Score
* Application Status
* Submitted date

Statuses:

* Submitted
* Under Review
* Shortlisted
* Rejected
* Selected

---

# 26. Application Detail

Sections:

### Startup Information

### Proposal

### Solution

### Technical Approach

### Price

### Pilot Plan

### Documents

### AI Summary

### Expert Evaluations

---

# 27. AI Proposal Summary

The frontend should provide a clearly labelled AI-generated summary.

Sections:

```text
Problem Understanding
Solution Approach
Key Capabilities
Strengths
Potential Weaknesses
Missing Information
Risks
```

Display disclaimer:

> AI-generated decision support. Final evaluation remains with authorized experts.

---

# 28. Expert Evaluation

Expert evaluation screen must support configurable criteria.

Default criteria from PS:

* Problem-solution fit
* Technical feasibility
* Innovation
* Scalability
* Cost effectiveness
* Security/compliance
* Pilot readiness

Each criterion:

```text
Score: 1–10

Comments:
[........................]
```

---

# 29. Independent Evaluation

Experts should not see other experts' scores before submitting their own evaluation.

After submission:

```text
Evaluation Submitted
Your score: 91/100
```

Government can later see aggregate results.

---

# 30. Evaluation Summary

Government screen:

```text
Expert 1       91
Expert 2       88
Expert 3       94
------------------
Average        91
```

Also show:

* Score distribution
* Comments
* Criterion-level scores
* Missing evaluations

Comments must be preserved for auditability.

---

# 31. Pilot Creation

Once a startup is selected:

**Create Pilot**

Required fields:

* Pilot name
* Startup
* Challenge
* Location
* Duration
* Budget
* Responsibilities
* Data access
* Security requirements
* Success criteria

---

# 32. Pilot Agreement

Display pilot agreement information:

```text
Selected Startup
Pilot Scope
Duration
Budget
Responsibilities
Data Access
Security Requirements
KPIs
Milestones
Success Criteria
```

Action:

**Approve Pilot**

---

# 33. Pilot Dashboard

This is a major demo screen.

Header:

```text
Waste Management Optimization Pilot

EcoRoute AI
Day 47 / 90

ACTIVE
```

---

## KPI Cards

Example:

```text
Missed Pickups

Baseline
100

Target
75

Actual
68

Target Achieved
```

Another:

```text
Citizen Complaints

Baseline
100
Target
75
Actual
71
```

Another:

```text
Route Distance

Baseline
100%
Target
80%
Actual
76%
```

The UI must make baseline → target → actual comparison immediately understandable.

The PS explicitly requires baseline definition, measurable success criteria, actual-vs-target comparison and supporting evidence.

---

# 34. KPI Management

Government and startup must be able to view:

* KPI
* Baseline
* Target
* Current actual
* Variance
* Status
* Evidence status
* Last updated

Statuses:

* Not Started
* On Track
* At Risk
* Target Achieved
* Failed
* Pending Validation

---

# 35. KPI Detail

KPI detail page:

```text
KPI: Missed Pickups

Baseline: 100
Target: 75
Current: 68

Improvement: 32%

Evidence:
5 files

Validation:
Pending
```

Chart:

```text
Baseline ───────── 100
Target   ────────    75
Actual   ───────     68
```

---

# 36. Evidence Upload

Users should be able to upload pilot evidence.

Supported conceptual categories:

* KPI reports
* Deployment reports
* Screenshots
* Operational records
* Supporting documents

Each evidence item:

* Name
* Type
* Uploaded by
* Upload date
* Related KPI
* Validation status

Statuses:

* Submitted
* Under Review
* Verified
* Rejected
* Clarification Required

---

# 37. Milestone Management

Pilot milestones:

```text
Milestone 1
Deployment
✓ Completed
Payment Released

Milestone 2
Integration
✓ Completed
Payment Released

Milestone 3
KPI Target
● Pending Verification

Milestone 4
Final Validation
○ Pending
```

Each milestone should include:

* Milestone name
* Deliverable
* Due date
* Completion status
* Evidence
* Verification status
* Payment status

---

# 38. Payment Tracking

Payment information:

```text
Milestone
Deliverable
Amount
Verification Status
Payment Status
```

Statuses:

* Pending
* Submitted
* Verified
* Approved
* Released
* Rejected

The interface should make clear that milestone-based payment is tied to verified deliverables rather than a single final payment.

---

# 39. Independent Validation Dashboard

Validator landing screen:

```text
Pending Validations
5

Completed
12
```

Validation queue:

* Pilot
* Startup
* KPI result
* Evidence count
* Submission date
* Status

---

# 40. Validation Detail

Show:

### Pilot Information

### Claimed Results

### Baseline

### Target

### Actual

### Methodology

### Evidence

### Supporting Documents

### KPI Calculations

---

## Validator Actions

```text
VALIDATE RESULT

REQUEST CLARIFICATION

REJECT RESULT
```

Validator must provide comments when rejecting or requesting clarification.

---

# 41. Validation Status

Statuses:

* Pending
* Under Review
* Validated
* Rejected
* Clarification Required

---

# 42. Scale Decision

Once validation is complete, government receives a decision screen.

Display:

```text
Pilot Performance
Validated KPI Results
Validation Report
Budget Performance
Success Criteria
Limitations
```

---

# 43. AI Scale Recommendation

AI may provide:

```text
SCALE RECOMMENDED

Reasons:

✓ KPI targets achieved
✓ Independent validation passed
✓ Pilot operationally successful
✓ Cost within approved budget
✓ Solution demonstrates scalability
```

Also show:

**Recommendation confidence/reasoning**

Do not make AI the final decision-maker.

---

# 44. Final Government Decision

Government officer can select:

```text
[ SCALE ]

[ EXTEND ]

[ STOP ]
```

Decision requires:

* Decision
* Reason
* Authorized by
* Date
* Comments

Confirmation modal:

> This decision will be recorded in the audit trail.

---

# 45. Reusable Pilot Evidence

After successful validation, create an evidence package.

Display:

```text
Waste Collection Optimization
Municipal Pilot

Baseline
Methodology
KPI Results
Validation Report
Limitations
Scale Recommendation
```

Action:

**Reuse for Similar Challenge**

The PS explicitly expects successful pilot evidence to be reusable by other departments.

---

# 46. Evidence Library

Government users can search previous pilot evidence.

Filters:

* Domain
* Department
* Location
* KPI
* Technology
* Success status
* Deployment type

Search example:

```text
Search:
Waste management
```

Results:

```text
Waste Route Optimization
Validated
Scale Recommended

Citizen Complaint Reduction
Validated
Scale Recommended
```

---

# 47. Similar Challenge Discovery

When creating a new challenge, UpStarty may show:

```text
Similar validated pilots found

3 departments have previously evaluated similar solutions.

[View Evidence]
```

This supports cross-department reuse.

---

# 48. Innovation Procurement Passport

Startup-facing profile must function as a reusable identity/evidence layer.

Sections:

### Company

* Name
* Description
* Registration
* Legal information

### Technology

* Technologies
* Capabilities
* Domains

### Experience

* Previous pilots
* Government deployments
* Relevant deployments

### Compliance

* Certifications
* Documents
* Legal status

### Readiness

* Pilot readiness
* Deployment locations
* Team capabilities

The PS calls this reusable profile the **Innovation Procurement Passport**.

---

# 49. Startup Dashboard

Startup home page:

KPI cards:

* Recommended Challenges
* Active Applications
* Shortlisted
* Active Pilots
* Pending Milestones
* Pending Payments

Sections:

```text
Recommended Opportunities
Application Status
Active Pilot
Upcoming Milestones
```

---

# 50. Startup Challenge Discovery

Challenge cards:

```text
Waste Management Optimization

Department:
Municipal Corporation

Budget:
₹XX

Pilot:
90 Days

Your Match:
94%

Eligibility:
Eligible

[View Challenge]
```

---

# 51. Startup Challenge Detail

Show:

* Problem
* Objective
* Expected outcome
* Budget
* Timeline
* KPIs
* Eligibility
* Required documents
* Evaluation criteria

CTA:

**Check Eligibility**

then:

**Apply Now**

---

# 52. Startup Application Flow

Multi-step form:

### Step 1

Startup Information

### Step 2

Solution

### Step 3

Technical Approach

### Step 4

Pricing

### Step 5

Pilot Plan

### Step 6

Expected Outcomes

### Step 7

Documents

### Step 8

Review & Submit

---

# 53. Startup Application Status

Timeline:

```text
✓ Application Submitted

✓ Eligibility Verified

● Expert Evaluation

○ Shortlisted

○ Pilot
```

Status must be clearly visible.

---

# 54. Startup Pilot Dashboard

Startup sees:

* Pilot status
* Days remaining
* KPI performance
* Milestones
* Evidence
* Payments
* Government messages

Startup should not be able to make government-only decisions.

---

# 55. Startup KPI Submission

Startup can submit:

* Actual KPI value
* Measurement date
* Methodology
* Evidence
* Comments

Government/validator can review.

---

# 56. Startup Payment Dashboard

Display:

```text
Total Pilot Budget
₹XX

Released
₹XX

Pending
₹XX
```

Milestone-wise breakdown.

---

# 57. Expert Dashboard

Expert homepage:

```text
Assigned Applications
Pending Evaluations
Completed Evaluations
```

Evaluation card:

```text
Waste Management
EcoRoute AI

Deadline:
2 days

[Start Evaluation]
```

---

# 58. Validator Dashboard

Validator homepage:

```text
Pending Validation
Completed Validation
Clarifications Required
```

Each item:

* Pilot
* Startup
* KPI
* Evidence
* Submitted date
* Status

---

# 59. Audit Trail

Audit trail must be available to authorized users.

Timeline example:

```text
Aug 20
Challenge created

Aug 20
AI challenge generated

Aug 21
Challenge published

Aug 25
Applications submitted

Aug 27
Expert evaluation completed

Aug 29
Startup selected

Sep 01
Pilot started

Oct 15
KPI submitted

Oct 20
Validation completed

Oct 22
Scale decision approved
```

Each event should store:

* Event type
* User
* Role
* Timestamp
* Related object
* Action
* Previous state if relevant
* New state if relevant

The PS explicitly requires important actions, decisions and timestamps to be recorded.

---

# 60. Notifications

Notification center should support:

* New challenge
* Application submitted
* Eligibility result
* Evaluation assigned
* Evaluation deadline
* Pilot milestone due
* KPI update
* Evidence validation
* Payment update
* Scale decision
* Clarification request

Notification categories:

* Action Required
* Information
* Warning
* Success

---

# 61. Role-Based Access

Frontend must hide unauthorized actions.

Example:

### Startup cannot:

* Approve eligibility
* Approve expert evaluation
* Validate its own pilot
* Make scale decision

### Expert cannot:

* Change eligibility
* Make final procurement decision

### Validator cannot:

* Make procurement decision

### Government can:

* Create challenge
* Configure rules
* Review applications
* Approve pilot
* Review validation
* Make authorized final decision

---

# 62. State Management

Every major entity must have explicit frontend states.

## Challenge

```text
DRAFT
PUBLISHED
APPLICATION_OPEN
EVALUATION
STARTUP_SELECTED
PILOT
COMPLETED
CLOSED
```

## Application

```text
DRAFT
SUBMITTED
ELIGIBILITY_REVIEW
ELIGIBLE
INELIGIBLE
UNDER_EVALUATION
SHORTLISTED
SELECTED
REJECTED
```

## Pilot

```text
PLANNED
AGREEMENT
DEPLOYMENT
ACTIVE
KPI_REVIEW
VALIDATION
COMPLETED
```

## Validation

```text
PENDING
UNDER_REVIEW
VALIDATED
REJECTED
CLARIFICATION_REQUIRED
```

## Scale Decision

```text
PENDING
SCALE
EXTEND
STOP
```

---

# 63. Loading States

Every asynchronous action must have a loading state.

Examples:

```text
Finding startups...
Generating challenge...
Checking eligibility...
Submitting evaluation...
Loading KPI data...
Validating evidence...
Generating recommendation...
```

Avoid frozen screens.

---

# 64. Empty States

Every list page must have meaningful empty states.

Example:

> No active challenges yet.

CTA:

**Create Challenge**

Startup:

> No applications yet.

CTA:

**Discover Challenges**

Expert:

> No evaluations assigned.

Validator:

> No pending validations.

---

# 65. Error States

Errors must be human-readable.

Bad:

```text
500 Internal Server Error
```

Better:

> We couldn't load the startup matches. Please try again.

Actions:

**Retry**

---

# 66. Form Validation

Frontend validation required for:

* Required fields
* Dates
* Budget
* Numeric KPI values
* File types
* File size
* URLs if applicable
* Duplicate entries
* Missing documents
* Invalid state transitions

---

# 67. Responsive Design

Primary target:

**Desktop**

because government/expert dashboards are data-heavy.

Secondary:

**Tablet**

Startup users should have a good tablet experience.

Mobile should support:

* Login
* Notifications
* Challenge browsing
* Application status
* Pilot status
* KPI viewing
* Basic approvals where appropriate

Complex tables should become cards on small screens.

---

# 68. Accessibility

The frontend should provide:

* Keyboard navigation
* Visible focus states
* Semantic HTML
* Accessible form labels
* Sufficient contrast
* Error messages associated with inputs
* Screen-reader-friendly status indicators
* Non-color-only status communication

Example:

Do not use only red/green.

Use:

```text
✓ Verified
⚠ At Risk
✕ Rejected
```

with accessible labels.

---

# 69. AI UX Rules

AI must always be clearly identifiable.

Use labels such as:

**AI Recommendation**

**AI Generated Summary**

**AI Suggested KPI**

AI-generated content should be editable where applicable.

AI must never appear to have made an official government decision.

Use:

> AI recommendation — final decision requires authorized government approval.

This follows the PS's requirement that AI act as decision support rather than replacing authorized government decisions.

---

# 70. AI Explainability

Whenever AI ranks or recommends something, the UI must show:

1. Recommendation
2. Reasons
3. Relevant evidence
4. Important limitations

Example:

```text
94% Match

Why?
✓ Technology fit
✓ Domain experience
✓ Previous deployment
✓ Pilot readiness

Potential concern:
• Limited deployment outside western region
```

---

# 71. Frontend Data Requirements

The frontend must be designed around these core entities:

```text
Department
Challenge
Startup
Application
Evaluation
Pilot
Pilot KPI
Milestone
Payment
Evidence
Validation
Scale Decision
Audit Event
Notification
User
```

The supplied PS recommends corresponding datasets for departments, challenges, startups, applications, evaluations, pilots, KPIs, milestones, validations and scale decisions.

---

# 72. Demo Data

For hackathon demonstration, the frontend should include realistic synthetic data.

Recommended scenario:

**Municipal Waste Management**

Example startup:

**EcoRoute AI**

Example pilot:

**90-day Waste Route Optimization Pilot**

Example KPIs:

```text
Missed Pickups
Citizen Complaints
Route Distance
Collection Efficiency
```

The PS itself recommends a municipal waste-management challenge as the primary demo scenario.

---

# 73. Main Demo Flow

The frontend must support this exact demo:

```text
Government Login
       ↓
Government Dashboard
       ↓
Create Waste Management Challenge
       ↓
Enter Rough Problem
       ↓
AI Problem Builder
       ↓
Structured Challenge
       ↓
Publish
       ↓
Find Matching Startups
       ↓
Explainable Match
       ↓
Eligibility Screening
       ↓
Application
       ↓
Expert Evaluation
       ↓
Select Startup
       ↓
Create 90-Day Pilot
       ↓
KPI Dashboard
       ↓
Milestones
       ↓
Evidence Submission
       ↓
Independent Validation
       ↓
AI Scale Recommendation
       ↓
Government Scale Decision
       ↓
Audit Trail
       ↓
Reusable Pilot Evidence
```

This sequence follows the PS's recommended best-demo scenario.

---

# 74. P0 Frontend Scope

The following screens are mandatory for the hackathon MVP:

```text
Login
Government Dashboard
Startup Dashboard
Challenge Creation
Startup Database
Eligibility Screening
Matching
Application
Expert Evaluation
Pilot Creation
KPI Tracking
Final Decision
```

This directly maps to the PS's P0 recommendation.

---

# 75. P1 Frontend Scope

These are the major differentiators:

```text
AI Problem Builder
Semantic Matching
Explainable Recommendations
Expert Panel
Milestone Tracking
Independent Validation
Audit Trail
Procurement Passport
Reusable Pilot Evidence
```

These map to the PS's P1 differentiators.

---

# 76. P2 Frontend Scope

Do not prioritize these during the core hackathon build:

```text
Live Government Database Integration
Live Startup Database Integration
E-Marketplace Integration
Automated Document Verification
Digital Signatures
Advanced Analytics
```

If shown, they should be represented as future/API-ready capabilities rather than fake integrations.

---

# 77. Frontend Component Hierarchy

Recommended reusable component architecture:

```text
components/
│
├── layout/
│   ├── Sidebar
│   ├── Topbar
│   ├── Breadcrumbs
│   └── PageHeader
│
├── ui/
│   ├── Button
│   ├── Input
│   ├── Select
│   ├── Modal
│   ├── Tabs
│   ├── Badge
│   ├── Card
│   ├── Table
│   └── Pagination
│
├── dashboard/
│   ├── MetricCard
│   ├── Pipeline
│   ├── ActivityTimeline
│   └── ActionQueue
│
├── challenges/
│   ├── ChallengeCard
│   ├── ChallengeTable
│   ├── ChallengeWizard
│   ├── KPIBuilder
│   └── EligibilityBuilder
│
├── ai/
│   ├── AIProblemBuilder
│   ├── AIRecommendation
│   ├── AISummary
│   ├── AIReasoning
│
├── startups/
│   ├── StartupCard
│   ├── StartupProfile
│   ├── MatchScore
│   └── MatchReasons
│
├── applications/
│   ├── ApplicationCard
│   ├── ProposalViewer
│   └── EvaluationPanel
│
├── pilots/
│   ├── PilotHeader
│   ├── KPIWidget
│   ├── MilestoneTimeline
│   ├── EvidenceUploader
│   └── PilotProgress
│
├── validation/
│   ├── ValidationQueue
│   ├── EvidenceViewer
│   └── ValidationDecision
│
└── audit/
    └── AuditTimeline
```

---

# 78. Frontend Routing

Conceptual route structure:

```text
/
 /login
 /register

 /government
 /government/challenges
 /government/challenges/new
 /government/challenges/:id
 /government/challenges/:id/matches
 /government/challenges/:id/applications
 /government/startups
 /government/startups/:id
 /government/applications/:id
 /government/evaluations
 /government/pilots
 /government/pilots/:id
 /government/pilots/:id/kpis
 /government/pilots/:id/milestones
 /government/validations
 /government/decisions
 /government/evidence
 /government/audit

 /startup
 /startup/challenges
 /startup/challenges/:id
 /startup/applications
 /startup/applications/:id
 /startup/passport
 /startup/pilots
 /startup/pilots/:id
 /startup/payments

 /expert
 /expert/evaluations
 /expert/evaluations/:id

 /validator
 /validator/validations
 /validator/validations/:id

 /admin
 /admin/users
 /admin/departments
 /admin/rules
 /admin/settings
```

---

# 79. Frontend-to-Backend Contract

Frontend should consume backend APIs rather than embedding business logic directly inside components.

Required conceptual APIs from the PS include:

```text
POST /api/challenges
GET /api/challenges
GET /api/challenges/{id}/matches
POST /api/startups
POST /api/challenges/{id}/apply
POST /api/applications/{id}/evaluate
POST /api/pilots
POST /api/pilots/{id}/kpis
POST /api/pilots/{id}/validate
POST /api/pilots/{id}/scale
```

These APIs are explicitly listed in the supplied PS.

---

# 80. Important Frontend Business Rules

### Rule 1

A startup cannot be selected before eligibility screening.

### Rule 2

An ineligible startup cannot proceed to final evaluation.

### Rule 3

Expert evaluation must remain independent.

### Rule 4

A pilot must have predefined KPIs.

### Rule 5

KPI results must be compared against baseline and target.

### Rule 6

Scale recommendation must use verified pilot results.

### Rule 7

AI cannot make the final procurement decision.

### Rule 8

Important decisions must appear in the audit trail.

### Rule 9

Milestone payment status must correspond to deliverable verification.

### Rule 10

Successful pilot evidence should be reusable.

---

# 81. Security UX

The frontend must visibly respect:

* Role-based access
* Protected routes
* Permission-based actions
* Secure document access
* Sensitive information visibility
* Session handling

The frontend must never expose an action simply because the user can reach its URL.

---

# 82. Document & Evidence UX

Every document should show:

```text
Document Name
Document Type
Uploaded By
Uploaded Date
Verification Status
Related Challenge/Pilot
```

Actions:

* View
* Download if authorized
* Replace if authorized
* Delete if authorized

---

# 83. Dashboard Visual Language

The dashboard should prioritize:

**What requires action?**

rather than simply showing statistics.

Priority hierarchy:

```text
1. Action Required
2. Active Workflows
3. Performance
4. Deadlines
5. Historical Information
```

---

# 84. Government Dashboard Success Criteria

A government officer should be able to understand within 5–10 seconds:

* How many challenges are active?
* Which applications require attention?
* Which pilots are active?
* Which KPIs are at risk?
* Which validations are pending?
* Which decisions are waiting?

---

# 85. Startup Dashboard Success Criteria

A startup should immediately understand:

* Which opportunities are relevant?
* Where it has applied?
* Whether it is shortlisted.
* Which pilots are active.
* Which milestones are pending.
* Which payments are pending.

---

# 86. Expert Dashboard Success Criteria

An expert should immediately understand:

* Which evaluations are assigned.
* Which are overdue.
* What requires action.
* What has already been submitted.

---

# 87. Validator Dashboard Success Criteria

A validator should immediately understand:

* Which pilot results require validation.
* Which evidence is missing.
* Which validations are overdue.
* Which results are awaiting clarification.

---

# 88. Final Frontend Definition of Done

The frontend is considered complete for the hackathon MVP only when a user can execute the complete workflow:

```text
Government creates problem
        ↓
AI structures problem
        ↓
Challenge published
        ↓
Startups discovered
        ↓
Eligibility checked
        ↓
Startup applies
        ↓
Experts evaluate
        ↓
Startup selected
        ↓
Pilot created
        ↓
KPIs tracked
        ↓
Milestones tracked
        ↓
Evidence submitted
        ↓
Independent validation
        ↓
Scale / Extend / Stop
        ↓
Audit history recorded
```

A screen-by-screen implementation that does not connect these states together should not be considered a completed UpStarty frontend.

---

# 89. Hackathon Priority Matrix

| Feature                 | Priority | Demo Importance |
| ----------------------- | -------- | --------------- |
| Authentication          | P0       | Medium          |
| Government Dashboard    | P0       | High            |
| Startup Dashboard       | P0       | Medium          |
| Challenge Creation      | P0       | Very High       |
| AI Problem Builder      | P1       | Very High       |
| Startup Database        | P0       | High            |
| Semantic Matching       | P1       | Very High       |
| Explainable Matching    | P1       | Very High       |
| Eligibility             | P0       | High            |
| Application             | P0       | High            |
| Expert Evaluation       | P0       | High            |
| Proposal Summary        | P1       | Medium          |
| Pilot Management        | P0       | Very High       |
| KPI Dashboard           | P0       | Very High       |
| Milestones              | P1       | High            |
| Payments                | P0/P1    | Medium          |
| Independent Validation  | P1       | Very High       |
| Scale Decision          | P0       | Very High       |
| AI Scale Recommendation | P1       | High            |
| Audit Trail             | P1       | High            |
| Procurement Passport    | P1       | Medium          |
| Reusable Evidence       | P1       | High            |
| Live Integrations       | P2       | Low             |
| Digital Signatures      | P2       | Low             |
| Advanced Analytics      | P2       | Low             |

---

# 90. Final Product Principle

Every frontend screen should answer one of these questions:

**What government problem are we solving?**

**Which startup can solve it?**

**Is that startup eligible?**

**How good is the proposed solution?**

**Can it prove its value through a controlled pilot?**

**Did the pilot actually achieve measurable results?**

**Were those results independently validated?**

**Should government scale the solution?**

If a feature does not contribute to this lifecycle, it should not receive priority during the hackathon.

## Core Product Flow

**Problem → Challenge → Match → Eligibility → Evaluate → Pilot → Measure → Validate → Decide → Scale**

That is the frontend backbone of UpStarty.
