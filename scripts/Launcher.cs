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
                string venvPythonW = Path.Combine(baseDir, ".venv", "Scripts", "pythonw.exe");
                string distExe = Path.Combine(baseDir, "dist", "VANTA", "VANTA.exe");
                string mainPy = Path.Combine(baseDir, "src", "vanta", "main.py");
                string setupBat = Path.Combine(baseDir, "setup.bat");

                ProcessStartInfo psi = new ProcessStartInfo();
                psi.WorkingDirectory = baseDir;

                if (File.Exists(distExe))
                {
                    psi.FileName = distExe;
                    psi.WorkingDirectory = Path.Combine(baseDir, "dist", "VANTA");
                    psi.UseShellExecute = false;
                }
                else if (File.Exists(venvPythonW) && File.Exists(mainPy))
                {
                    psi.FileName = venvPythonW;
                    psi.Arguments = "-m vanta.main";
                    string existingPythonPath = Environment.GetEnvironmentVariable("PYTHONPATH");
                    string srcDir = Path.Combine(baseDir, "src");
                    if (!string.IsNullOrEmpty(existingPythonPath))
                    {
                        psi.EnvironmentVariables["PYTHONPATH"] = srcDir + ";" + existingPythonPath;
                    }
                    else
                    {
                        psi.EnvironmentVariables["PYTHONPATH"] = srcDir;
                    }
                    psi.UseShellExecute = false;
                }
                else if (File.Exists(setupBat))
                {
                    // Run setup if virtual environment is not yet created
                    var setupInfo = new ProcessStartInfo();
                    setupInfo.FileName = "cmd.exe";
                    setupInfo.Arguments = "/c setup.bat";
                    setupInfo.WorkingDirectory = baseDir;
                    setupInfo.UseShellExecute = true;
                    Process setupProc = Process.Start(setupInfo);
                    setupProc.WaitForExit();

                    if (File.Exists(venvPythonW))
                    {
                        psi.FileName = venvPythonW;
                        psi.Arguments = "-m vanta.main";
                        psi.EnvironmentVariables["PYTHONPATH"] = Path.Combine(baseDir, "src");
                        psi.UseShellExecute = false;
                    }
                    else
                    {
                        MessageBox.Show("Could not initialize environment. Please run setup.bat manually.", "VANTA Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return;
                    }
                }
                else
                {
                    MessageBox.Show("VANTA executable components were not found.", "VANTA Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                // Pass through any command-line arguments (e.g. --portable, --software-gl)
                if (args != null && args.Length > 0)
                {
                    psi.Arguments += " " + string.Join(" ", args);
                }

                Process.Start(psi);
            }
            catch (Exception ex)
            {
                MessageBox.Show("Failed to launch VANTA studio:\n\n" + ex.Message, "VANTA Launcher Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
