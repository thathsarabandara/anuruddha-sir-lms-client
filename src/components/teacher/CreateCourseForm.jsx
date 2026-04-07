import { BiLoader } from "react-icons/bi";

export const CreateCourseForm = ({
  formData,
  handleInputChange,
  handleCreateCourse,
  setShowCreateModal,
  resetForm,
  subjects = [],
  gradeLevels = [],
  courseTypes = [],
  languages = [],
  isSubmitting = false,
}) => {
  return (
    <>
        <form onSubmit={handleCreateCourse} className="p-6">
          {/* Course Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Course Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Complete Mathematics for Grade 5"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your course..."
              required
            />
          </div>

          {/* Subject and Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject.value || subject.id} value={subject.value || subject.id}>
                    {subject.label || subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Grade Level</label>
              <select
                name="grade_level"
                value={formData.grade_level}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Grade</option>
                {gradeLevels.map(grade => (
                  <option key={grade.value || grade.id} value={grade.value || grade.id}>{grade.label || grade.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Language *</label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Type, Price Type and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Course Type</label>
              <select
                name="course_type"
                value={formData.course_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {courseTypes.map((type) => (
                  <option key={type.value || type.id} value={type.value || type.id}>
                    {type.label || type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
              <select
                name="price_type"
                value={formData.price_type}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
            </div>

            {formData.price_type === 'PAID' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          {/* Status and Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Visibility</label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="PUBLIC">Public</option>
                <option value="PRIVATE">Private</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setShowCreateModal(false); resetForm(); }}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 btn-primary py-3 font-semibold justify-center flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <div className="flex items-center"><BiLoader className="inline-block mr-2 animate-spin" /><p>Creating...</p></div> : 'Create Course'}
            </button>
          </div>
        </form>
     </>
  );
}

export default CreateCourseForm;