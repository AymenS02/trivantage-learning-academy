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
                            onClick={() =>
                              alert(
                                JSON.stringify(enrollment, null, 2)
                              )
                            }
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
      </div>
    </main>
  );
}
