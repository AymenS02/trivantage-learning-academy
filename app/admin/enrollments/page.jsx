"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminEnrollments() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [updating, setUpdating] = useState(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.role !== "admin") {
      router.push("/programs");
      return;
    }

    setUser(userData);
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, filter]);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/enrollment-requests?status=${filter}&limit=100`
      );
      const data = await response.json();

      if (data.success) {
        setEnrollments(data.data);
      }
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (enrollmentId, newStatus) => {
    if (
      !confirm(
        `Are you sure you want to ${newStatus} this enrollment request?`
      )
    ) {
      return;
    }

    setUpdating(enrollmentId);
    try {
      const response = await fetch(`/api/enrollment-requests/${enrollmentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          reviewedBy: user._id,
          reviewedAt: new Date(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Enrollment ${newStatus} successfully!`);
        fetchEnrollments();
      } else {
        alert(`Failed to update enrollment: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating enrollment:", error);
      alert("An error occurred while updating the enrollment");
    } finally {
      setUpdating(null);
    }
  };

  if (loading && !user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-primary/70">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-primary/70 hover:text-primary mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-semibold text-primary mb-2">
            Enrollment Requests
          </h1>
          <p className="text-sm text-primary/70">
            Review and manage student enrollment applications
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {["pending", "accepted", "rejected"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors capitalize",
                filter === status
                  ? "border-primary bg-primary text-secondary-light"
                  : "border-border bg-background text-primary hover:bg-secondary-light/60",
              ].join(" ")}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Enrollments Table */}
        <div className="rounded-2xl border border-border bg-surface shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 text-center">
              <p className="text-sm text-primary/70">Loading enrollments...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-sm text-primary/70">
                No {filter} enrollment requests found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-light/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Contact
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Date Submitted
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {enrollments.map((enrollment) => (
                    <tr
                      key={enrollment._id}
                      className="hover:bg-secondary-light/30"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-primary">
                          {enrollment.firstName} {enrollment.lastName}
                        </p>
                        {enrollment.gender && (
                          <p className="text-xs text-primary/70">
                            {enrollment.gender}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-primary">
                          {enrollment.selectedCourse?.title || "N/A"}
                        </p>
                        <p className="text-xs text-primary/70">
                          ${enrollment.selectedCourse?.price || 0}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-primary">
                          {enrollment.email}
                        </p>
                        {enrollment.phone && (
                          <p className="text-xs text-primary/70">
                            {enrollment.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-primary">
                          {new Date(enrollment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-primary/70">
                          {new Date(enrollment.createdAt).toLocaleTimeString()}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={[
                            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
                            enrollment.status === "pending"
                              ? "bg-secondary-light text-primary"
                              : enrollment.status === "accepted"
                              ? "bg-accent/20 text-accent"
                              : "bg-error/20 text-error",
                          ].join(" ")}
                        >
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {enrollment.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    enrollment._id,
                                    "accepted"
                                  )
                                }
                                disabled={updating === enrollment._id}
                                className="rounded-lg bg-accent text-secondary-light px-3 py-1.5 text-xs font-semibold hover:bg-accent/80 transition disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateStatus(
                                    enrollment._id,
                                    "rejected"
                                  )
                                }
                                disabled={updating === enrollment._id}
                                className="rounded-lg bg-error text-secondary-light px-3 py-1.5 text-xs font-semibold hover:bg-error/80 transition disabled:opacity-50"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setSelectedEnrollment(enrollment)}
                            className="rounded-lg border border-border bg-background text-primary px-3 py-1.5 text-xs font-semibold hover:bg-secondary-light/60 transition"
                          >
                            View Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedEnrollment && (
          <div className="fixed inset-0 bg-primary-dark/50 flex items-center justify-center z-50 p-4">
            <div className="bg-surface rounded-2xl border border-border shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-primary">
                  Enrollment Details
                </h2>
                <button
                  onClick={() => setSelectedEnrollment(null)}
                  className="text-primary/70 hover:text-primary text-2xl leading-none"
                >
                  ×
                </button>
              </div>
              <div className="p-6 space-y-6">
                <section>
                  <h3 className="text-sm font-semibold text-primary mb-3">
                    Personal Information
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-primary/70">Name</p>
                      <p className="text-primary">
                        {selectedEnrollment.firstName} {selectedEnrollment.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary/70">Email</p>
                      <p className="text-primary">{selectedEnrollment.email}</p>
                    </div>
                    {selectedEnrollment.phone && (
                      <div>
                        <p className="text-primary/70">Phone</p>
                        <p className="text-primary">{selectedEnrollment.phone}</p>
                      </div>
                    )}
                    {selectedEnrollment.gender && (
                      <div>
                        <p className="text-primary/70">Gender</p>
                        <p className="text-primary">{selectedEnrollment.gender}</p>
                      </div>
                    )}
                  </div>
                </section>

                {selectedEnrollment.selectedCourse && (
                  <section className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      Course Selection
                    </h3>
                    <div className="rounded-lg border border-border bg-background p-4">
                      <p className="text-sm font-semibold text-primary mb-1">
                        {selectedEnrollment.selectedCourse.title}
                      </p>
                      <p className="text-xs text-primary/70">
                        {selectedEnrollment.selectedCourse.category} • $
                        {selectedEnrollment.selectedCourse.price}
                      </p>
                    </div>
                  </section>
                )}

                {(selectedEnrollment.address || selectedEnrollment.city || selectedEnrollment.country) && (
                  <section className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      Address
                    </h3>
                    <div className="text-sm text-primary space-y-1">
                      {selectedEnrollment.addressMultiline && (
                        <p>{selectedEnrollment.addressMultiline}</p>
                      )}
                      {selectedEnrollment.address && <p>{selectedEnrollment.address}</p>}
                      <p>
                        {[
                          selectedEnrollment.city,
                          selectedEnrollment.postalCode,
                          selectedEnrollment.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </section>
                )}

                {(selectedEnrollment.workExperience || selectedEnrollment.educationBackground) && (
                  <section className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      Background
                    </h3>
                    <div className="space-y-3 text-sm">
                      {selectedEnrollment.workExperience && (
                        <div>
                          <p className="text-primary/70 mb-1">Work Experience</p>
                          <p className="text-primary">
                            {selectedEnrollment.workExperience}
                          </p>
                        </div>
                      )}
                      {selectedEnrollment.educationBackground && (
                        <div>
                          <p className="text-primary/70 mb-1">Education</p>
                          <p className="text-primary">
                            {selectedEnrollment.educationBackground}
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {selectedEnrollment.specialNeeds && (
                  <section className="border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-primary mb-3">
                      Special Needs
                    </h3>
                    <p className="text-sm text-primary">
                      {selectedEnrollment.specialNeeds}
                    </p>
                  </section>
                )}

                <section className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-primary mb-3">
                    Submission Details
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2 text-sm">
                    <div>
                      <p className="text-primary/70">Status</p>
                      <span
                        className={[
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize mt-1",
                          selectedEnrollment.status === "pending"
                            ? "bg-secondary-light text-primary"
                            : selectedEnrollment.status === "accepted"
                            ? "bg-accent/20 text-accent"
                            : "bg-error/20 text-error",
                        ].join(" ")}
                      >
                        {selectedEnrollment.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-primary/70">Submitted On</p>
                      <p className="text-primary">
                        {new Date(selectedEnrollment.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
