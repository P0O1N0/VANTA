using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace VantaLauncher
{
    static class Program
    {
        [STAThread]
        static void Main(string[] args)
        {
            try
            {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory.TrimEnd(Path.DirectorySeparatorChar, Path.AltDirectorySeparatorChar);
                string studioHtml = Path.Combine(baseDir, "studio", "index.html");
                string distExe = Path.Combine(baseDir, "dist", "VANTA", "VANTA.exe");
                string venvPythonW = Path.Combine(baseDir, ".venv", "Scripts", "pythonw.exe");
                string mainPy = Path.Combine(baseDir, "src", "vanta", "main.py");

                bool forceQt = false;
                if (args != null)
                {
                    foreach (string arg in args)
                    {
                        if (arg.Equals("--qt", StringComparison.OrdinalIgnoreCase) ||
                            arg.Equals("--pyside", StringComparison.OrdinalIgnoreCase) ||
                            arg.Equals("--desktop", StringComparison.OrdinalIgnoreCase))
                        {
                            forceQt = true;
                            break;
                        }
                    }
                }

                // If Qt is not explicitly requested and studio/index.html exists, launch modern WebGL/Canvas Studio
                if (!forceQt && File.Exists(studioHtml))
                {
                    string fileUri = "file:///" + studioHtml.Replace('\\', '/');

                    string[] browserCandidates = new string[]
                    {
                        @"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
                        @"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
                        @"C:\Program Files\Google\Chrome\Application\chrome.exe",
                        @"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
                        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Microsoft\Edge\Application\msedge.exe"),
                        Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), @"Google\Chrome\Application\chrome.exe")
                    };

                    string chosenBrowser = null;
                    foreach (string path in browserCandidates)
                    {
                        if (File.Exists(path))
                        {
                            chosenBrowser = path;
                            break;
                        }
                    }

                    if (chosenBrowser != null)
                    {
                        ProcessStartInfo psi = new ProcessStartInfo
                        {
                            FileName = chosenBrowser,
                            Arguments = string.Format("--app=\"{0}\" --window-size=1440,920 --disable-pinch", fileUri),
                            WorkingDirectory = baseDir,
                            UseShellExecute = false
                        };
                        Process.Start(psi);
                        return;
                    }
                    else
                    {
                        // Fallback to default browser
                        ProcessStartInfo psi = new ProcessStartInfo
                        {
                            FileName = studioHtml,
                            UseShellExecute = true
                        };
                        Process.Start(psi);
                        return;
                    }
                }

                // Fallback to PySide6 Qt GUI
                if (File.Exists(distExe))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = distExe,
                        WorkingDirectory = Path.Combine(baseDir, "dist", "VANTA"),
                        UseShellExecute = false
                    };
                    Process.Start(psi);
                }
                else if (File.Exists(venvPythonW) && File.Exists(mainPy))
                {
                    ProcessStartInfo psi = new ProcessStartInfo
                    {
                        FileName = venvPythonW,
                        Arguments = "-m vanta.main",
                        WorkingDirectory = baseDir,
                        UseShellExecute = false
                    };
                    string existingPythonPath = Environment.GetEnvironmentVariable("PYTHONPATH");
                    string srcDir = Path.Combine(baseDir, "src");
                    psi.EnvironmentVariables["PYTHONPATH"] = string.IsNullOrEmpty(existingPythonPath) ? srcDir : (srcDir + ";" + existingPythonPath);
                    Process.Start(psi);
                }
                else
                {
                    MessageBox.Show("Could not find VANTA Studio or Python runtime.", "VANTA Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to launch VANTA:\n\n" + ex.Message, "VANTA Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}