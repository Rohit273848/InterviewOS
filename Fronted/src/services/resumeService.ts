// import api from './api'

export const analyzeResumeService = async (_file: File) => {
  // const formData = new FormData()
  // formData.append('resume', file)
  // const response = await api.post('/resume/analyze', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data'
  //   }
  // })
  // return response.data

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        score: 85,
        strengths: [
          'Strong technical skills section',
          'Quantified achievements',
          'Relevant project experience',
          'Clean formatting and structure'
        ],
        weaknesses: [
          'Missing action verbs in some descriptions',
          'Could add more metrics to projects',
          'Summary section needs improvement'
        ],
        suggestions: [
          'Add specific metrics to your achievements (e.g., "Improved performance by 40%")',
          'Start bullet points with strong action verbs',
          'Include links to GitHub and LinkedIn',
          'Add a compelling professional summary at the top'
        ]
      })
    }, 2000)
  })
}
