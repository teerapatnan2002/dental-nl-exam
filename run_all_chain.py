"""Chain: wait for the 8-PDF NL2 ingest job, then run the master sweep (NLLaw + leftovers)."""
import os
import sys
import time
import subprocess

PROJ = "/Users/admin/Downloads/NL Test"

def wait_for_proc(pid, timeout=7200):
    """Poll for a PID to exit (macOS)."""
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            os.kill(pid, 0)
        except ProcessLookupError:
            return True  # exited
        time.sleep(20)
    return False

def main():
    # 1. wait for the running NL2 8-pdf job (if still alive)
    cur_pid = 19985
    try:
        os.kill(cur_pid, 0)
        alive = True
    except ProcessLookupError:
        alive = False
    if alive:
        print(f"Waiting for NL2 ingest job (pid {cur_pid}) to finish ...")
        wait_for_proc(cur_pid)
        print("NL2 job finished.")
    else:
        print("NL2 job already finished.")

    # 2. run the master sweep (skips already-parsed via fuzzy match)
    print("Launching master sweep over all remaining PDFs ...")
    env = dict(os.environ)
    subprocess.run(
        [sys.executable, "sweep_all_pdfs.py"],
        cwd=PROJ, env=env,
    )
    print("=== ALL PDF INGEST CHAIN COMPLETE ===")

if __name__ == "__main__":
    sys.path.insert(0, PROJ)
    main()
